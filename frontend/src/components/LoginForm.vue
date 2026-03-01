<template>
    <form @submit.prevent="login">
      <div>
        <label>Username:</label>
        <input v-model="username" type="text" required />
      </div>
      <div>
        <label>Password:</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit">Login</button>
      <p v-if="error" style="color:red">{{ error }}</p>
    </form>
  </template>
  
  <script>
  import axios from 'axios';
  import router from '../router';
  
  export default {
    data() {
      return {
        username: '',
        password: '',
        error: ''
      };
    },
    methods: {
      async login() {
        try {
          const res = await axios.post('http://localhost:5050/api/auth/login', {
            username: this.username,
            password: this.password
          });
          localStorage.setItem('token', res.data.token);
          router.push('/home');
        } catch (err) {
          this.error = err.response?.data?.message || 'Login failed';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  form {
    display: flex;
    flex-direction: column;
    width: 300px;
  }
  div {
    margin-bottom: 15px;
  }
  button {
    padding: 8px;
    cursor: pointer;
  }
  </style>