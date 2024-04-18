<template>
  <div class="container">
    <h1>Network Interfaces</h1>
    <div class="filter">
      <label for="interface-filter">Filter by type:</label>
      <select id="interface-filter" v-model="selectedFilter" class="custom-dropdown">
        <option value="all">All Interfaces</option>
        <option value="wireless">Wireless</option>
        <option value="bridged">Bridged</option>
      </select>
    </div>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else>
      <table class="interface-table">
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
          <tr v-for="(networkInterface, index) in filteredInterfaces" :key="index">
            <td>{{ networkInterface.name }}</td>
            <td>{{ networkInterface.type }}</td>
            <td>{{ networkInterface.mtu }}</td>
            <td>{{ networkInterface.running }}</td>
            <td>{{ networkInterface['mac-address'] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Button to go back to Dashboard -->
    <div class="footer">
        <v-btn @click="goToDashboard">Back to Dashboard</v-btn>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter from vue-router

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
    const router = useRouter(); // Use useRouter to access the router instance
    const networkInterfaces = ref([]);
    const loading = ref(true);
    const selectedFilter = ref("all");

    const filteredInterfaces = computed(() => {
      if (selectedFilter.value === "all") {
        return networkInterfaces.value;
      } else {
        return networkInterfaces.value.filter(iface => iface.type === selectedFilter.value);
      }
    });

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

    const goToDashboard = () => {
      // Redirect to the Dashboard route using the router instance
      router.push('/dashboard');
    };

    return { networkInterfaces, loading, selectedFilter, filteredInterfaces, goToDashboard };
  }
};
</script>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
}

h1 {
  margin-left: 20px;
}

.filter {
  margin-bottom: 20px;
}

.custom-dropdown {
  background-color: #f2f2f2;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 8px;
}

.interface-table {
  width: 80%;
  border-collapse: collapse;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.interface-table th,
.interface-table td {
  padding: 12px;
  border-bottom: 1px solid #dddddd;
  text-align: left;
}

.interface-table th {
  background-color: #f2f2f2;
}

.loading {
  margin-top: 20px;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
}
</style>
