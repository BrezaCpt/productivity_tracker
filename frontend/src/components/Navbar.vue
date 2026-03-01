<template>
    <div class="navbar">
      <h2>Productivity Tracker</h2>
      <button @click="logout">Logout</button>
    </div>
  </template>
  
  <script>
  import router from '../router';
  
  export default {
    methods: {
      logout() {
        localStorage.removeItem('token');
        router.push('/login');
      }
    }
  };
  </script>
  
  <style scoped>
  .navbar {
    width: 200px;
    background: #f0f0f0;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  button {
    padding: 5px;
    cursor: pointer;
  }
  </style>