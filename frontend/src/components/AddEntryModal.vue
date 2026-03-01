<template>
    <div v-if="visible" class="modal">
      <div class="modal-content">
        <h3>Add Entry</h3>
        <form @submit.prevent="submit">
          <div>
            <label>Date:</label>
            <input type="date" v-model="form.date" required />
          </div>
          <div>
            <label>Type:</label>
            <select v-model="form.identifier_type" required>
              <option>MSISDN</option>
              <option>IMEI</option>
              <option>IP</option>
              <option>ID</option>
              <option>IMSI</option>
              <option>Email</option>
            </select>
          </div>
          <div>
            <label>Value:</label>
            <input type="text" v-model="form.identifier_value" required />
          </div>
          <!-- Checkbox fields -->
          <div v-for="field in checkFields" :key="field.key">
            <label>{{ field.label }}</label>
            <input type="checkbox" v-model="form[field.key]" />
          </div>
          <div>
            <label>Reference #:</label>
            <input type="text" v-model="form.reference_number" />
          </div>
          <button type="submit">Add</button>
          <button type="button" @click="$emit('close')">Cancel</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  export default {
    props: ['visible'],
    data() {
      return {
        form: {
          date: '',
          identifier_type: '',
          identifier_value: '',
          reference_number: '',
          rica: false,
          cdr: false,
          data_records: false,
          tower_dump: false,
          recharge_history: false,
          imei_mapping: false,
          msisdn_profile: false
        },
        checkFields: [
          { key: 'rica', label: 'RICA' },
          { key: 'cdr', label: 'CDR' },
          { key: 'data_records', label: 'Data Records' },
          { key: 'tower_dump', label: 'Tower Dump' },
          { key: 'recharge_history', label: 'Recharge History' },
          { key: 'imei_mapping', label: 'IMEI Mapping' },
          { key: 'msisdn_profile', label: 'MSISDN Profile' }
        ]
      };
    },
    methods: {
      async submit() {
        try {
          const token = localStorage.getItem('token');
          await axios.post('http://localhost:5050/api/productivity', this.form, {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.$emit('added');
          this.$emit('close');
        } catch (err) {
          console.error(err);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal-content {
    background: white;
    padding: 20px;
    width: 400px;
  }
  form div {
    margin-bottom: 10px;
  }
  button {
    margin-right: 10px;
    padding: 5px;
  }
  </style>