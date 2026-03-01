<template>
    <div class="login-page">
      <h1>Productivity Tracker Login</h1>
      <LoginForm />
    </div>
  </template>
  
  <script>
  import LoginForm from '../components/LoginForm.vue';
  
  export default {
    components: { LoginForm }
  };
  </script>
  
  <style scoped>
  .login-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
  }
  </style>