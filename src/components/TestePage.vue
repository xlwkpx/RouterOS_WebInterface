<template>
  <div>
    <h1>Interfaces</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>MTU</th>
            <th>Running</th>
            <th>Mac Address</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(networkInterface, index) in networkInterfaces" :key="index">
            <td>{{ networkInterface.name }}</td>
            <td>{{ networkInterface.type }}</td>
            <td>{{ networkInterface.mtu }}</td>
            <td>{{ networkInterface.running }}</td>
            <td>{{ networkInterface['mac-address'] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

const username = 'admin';
const password = '12345';
const basicAuth = btoa(`${username}:${password}`);

const getInterfaces = () => {
  return fetch('/rest/interface', {
    method: "GET",
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Basic ${basicAuth}`
    }
  })
  .then(response => response.json())
  .then(responseData => {
    return responseData.map(item => {
      const newItem = {};
      for (const key in item) {
        newItem[key.replace(/^\./, '')] = item[key];
      }
      return newItem;
    });
  })
  .catch(error => {
    console.error('Error fetching network interfaces:', error);
    return [];
  });
};

export default {
  setup() {
    const networkInterfaces = ref([]);
    const loading = ref(true);

    onMounted(async () => {
      try {
        const data = await getInterfaces();
        networkInterfaces.value = data;
      } catch (error) {
        console.error('Error:', error);
      } finally {
        loading.value = false;
      }
    });

    return { networkInterfaces, loading };
  }
};
</script>

<style scoped>
.page-title {
  text-align: center;
  margin-bottom: 20px; /* Espaçamento abaixo do título */
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
}
</style>
