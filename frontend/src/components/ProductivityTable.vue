<template>
    <div>
      <button @click="showModal = true">Add Entry</button>
      <input v-model="search" placeholder="Search..." />
  
      <table border="1" cellspacing="0" cellpadding="5">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Value</th>
            <th>Reference #</th>
            <th v-for="col in checkboxCols" :key="col">{{ col }}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in filteredEntries" :key="entry.id">
            <td>{{ entry.date }}</td>
            <td>{{ entry.identifier_type }}</td>
            <td>{{ entry.identifier_value }}</td>
            <td>{{ entry.reference_number }}</td>
            <td v-for="col in checkboxCols" :key="col">
              <input type="checkbox" disabled :checked="entry[col]" />
            </td>
            <td>
              <button @click="deleteEntry(entry.id)">🗑️</button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4">Totals</td>
            <td v-for="col in checkboxCols" :key="col">
              {{ total(col) }}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
  
      <AddEntryModal
        :visible="showModal"
        @close="showModal = false"
        @added="fetchEntries"
      />
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import AddEntryModal from './AddEntryModal.vue';
  
  export default {
    components: { AddEntryModal },
    data() {
      return {
        entries: [],
        showModal: false,
        search: '',
        checkboxCols: ['rica','cdr','data_records','tower_dump','recharge_history','imei_mapping','msisdn_profile']
      };
    },
    computed: {
      filteredEntries() {
        if (!this.search) return this.entries;
        return this.entries.filter(e =>
          e.identifier_value.toLowerCase().includes(this.search.toLowerCase()) ||
          e.identifier_type.toLowerCase().includes(this.search.toLowerCase())
        );
      }
    },
    methods: {
      async fetchEntries() {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get('http://localhost:5050/api/productivity', {
            headers: { Authorization: `Bearer ${token}` }
          });
          // Ensure it's an array
         this.entries = Array.isArray(res.data) ? res.data : [];
        } catch (err) {
          console.error(err);
        }
      },
      async deleteEntry(id) {
        if (!confirm('Are you sure you want to delete this entry?')) return;
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`http://localhost:5050/api/productivity/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.fetchEntries();
        } catch (err) {
          console.error(err);
        }
      },
      total(col) {
        return this.entries.filter(e => e[col]).length;
      }
    },
    mounted() {
      this.fetchEntries();
    }
  };
  </script>
  
  <style scoped>
  table {
    width: 100%;
    margin-top: 15px;
  }
  input[type="text"] {
    margin-left: 10px;
    margin-bottom: 10px;
    padding: 5px;
  }
  button {
    padding: 5px;
    margin: 5px 0;
    cursor: pointer;
  }
  </style>