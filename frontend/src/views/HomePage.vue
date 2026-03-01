<template>
    <div class="home-page">
      <Navbar />
      <div class="content">
        <ProductivityTable />
      </div>
    </div>
  </template>
  
  <script>
  import Navbar from '../components/Navbar.vue';
  import ProductivityTable from '../components/ProductivityTable.vue';
  
  export default {
    components: { Navbar, ProductivityTable }
  };
  </script>
  
  <style scoped>
  .home-page {
    display: flex;
    height: 100vh;
  }
  
  .content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
  }
  </style>