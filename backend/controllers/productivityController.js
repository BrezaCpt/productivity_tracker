const pool = require('../config/db');

// Add new productivity entry
const addEntry = async (req, res) => {
    try {
        const { id: userId } = req.user;

        const {
            date,
            identifier_type,
            identifier_value,
            reference_number,
            rica,
            cdr,
            data_records,
            tower_dump,
            recharge_history,
            imei_mapping,
            msisdn_profile
        } = req.body;

        // Default to today if date not provided
        const entryDate = date || new Date().toISOString().slice(0, 10);

        const result = await pool.query(
            `INSERT INTO productivity_entries 
            (user_id, date, identifier_type, identifier_value, reference_number, rica, cdr, data_records, tower_dump, recharge_history, imei_mapping, msisdn_profile)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
            RETURNING *`,
            [userId, entryDate, identifier_type, identifier_value, reference_number, rica, cdr, data_records, tower_dump, recharge_history, imei_mapping, msisdn_profile]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get productivity entries with totals, filtering and search
const getEntries = async (req, res) => {
    try {
        const { id: userId, role } = req.user;
        const { start_date, end_date, identifier_type, search } = req.query;

        let query = `SELECT * FROM productivity_entries WHERE 1=1`;
        const params = [];
        let paramIndex = 1;

        // Users see only their own entries
        if (!(role === 'manager' || role === 'admin')) {
            query += ` AND user_id = $${paramIndex}`;
            params.push(userId);
            paramIndex++;
        }

        // Date range filter
        if (start_date) {
            query += ` AND date >= $${paramIndex}`;
            params.push(start_date);
            paramIndex++;
        }
        if (end_date) {
            query += ` AND date <= $${paramIndex}`;
            params.push(end_date);
            paramIndex++;
        }

        // Identifier type filter
        if (identifier_type) {
            query += ` AND identifier_type = $${paramIndex}`;
            params.push(identifier_type);
            paramIndex++;
        }

        // Search filter (identifier_value or reference_number)
        if (search) {
            query += ` AND (identifier_value ILIKE $${paramIndex} OR reference_number ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        // Order by date descending
        query += ` ORDER BY date DESC, id DESC`;

        const result = await pool.query(query, params);
        const entries = result.rows;

        // Calculate totals for boolean columns
        const totals = {
            rica: 0,
            cdr: 0,
            data_records: 0,
            tower_dump: 0,
            recharge_history: 0,
            imei_mapping: 0,
            msisdn_profile: 0
        };

        entries.forEach(entry => {
            totals.rica += entry.rica ? 1 : 0;
            totals.cdr += entry.cdr ? 1 : 0;
            totals.data_records += entry.data_records ? 1 : 0;
            totals.tower_dump += entry.tower_dump ? 1 : 0;
            totals.recharge_history += entry.recharge_history ? 1 : 0;
            totals.imei_mapping += entry.imei_mapping ? 1 : 0;
            totals.msisdn_profile += entry.msisdn_profile ? 1 : 0;
        });

        res.status(200).json({ entries, totals });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete productivity entry by ID
const deleteEntry = async (req, res) => {
    try {
        const { id: userId, role } = req.user;
        const entryId = req.params.id;

        // Fetch the entry first
        const entryResult = await pool.query(
            'SELECT * FROM productivity_entries WHERE id = $1',
            [entryId]
        );

        if (entryResult.rows.length === 0) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        const entry = entryResult.rows[0];

        // Only owner or manager/admin can delete
        if (entry.user_id !== userId && !(role === 'manager' || role === 'admin')) {
            return res.status(403).json({ message: 'Forbidden: cannot delete this entry' });
        }

        // Delete the entry
        await pool.query('DELETE FROM productivity_entries WHERE id = $1', [entryId]);

        // Insert audit log
        await pool.query(
            'INSERT INTO audit_logs (user_id, action, table_name, record_id) VALUES ($1,$2,$3,$4)',
            [userId, 'DELETE', 'productivity_entries', entryId]
        );

        res.status(200).json({ message: 'Entry deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { addEntry, getEntries, deleteEntry };