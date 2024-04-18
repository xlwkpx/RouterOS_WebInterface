<template>
  <div class="container">
    <h1>IP Addresses</h1>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else>
      <table class="ip-addresses-table">
        <thead>
          <tr>
            <th>Ip Address</th>
            <th>Name</th>
            <th>MAC Address</th>
            <th>MTU</th>
            <th>Running</th>
            <!-- Add more columns as needed -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(address, index) in ipAddresses" :key="index">
           <td>192.168.79.{{ address.id || '-' }}</td>
            <td>{{ address.name || '-' }}</td>
            <td>{{ address['mac-address'] || '-' }}</td>
            <td>{{ address.mtu || '-' }}</td>
            <td>{{ address.running || '-' }}</td>
            <!-- Add more columns as needed -->
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const username = 'admin';
const password = '12345';
const basicAuth = btoa(`${username}:${password}`);

const getIpAddresses = async () => {
  try {
    const response = await fetch('/rest/interface', {
      method: "GET",
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Basic ${basicAuth}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch IP addresses');
    }
    const responseData = await response.json();
    return responseData.map(address => {
      const newAddress = {};
      for (const key in address) {
        newAddress[key.replace(/^\./, '')] = address[key];
      }
      return newAddress;
    });
  } catch (error) {
    console.error('Error fetching IP addresses:', error);
    return [];
  }
};

export default {
  setup() {
    const router = useRouter();
    const ipAddresses = ref([]);
    const loading = ref(true);

    onMounted(async () => {
      try {
        ipAddresses.value = await getIpAddresses();
      } catch (error) {
        console.error('Error:', error);
      } finally {
        loading.value = false;
      }
    });

    const goToDashboard = () => {
      router.push('/dashboard');
    };

    return { ipAddresses, loading, goToDashboard };
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

.ip-addresses-table {
  width: 90%;
  border-collapse: collapse;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-bottom: 20px;
}

.ip-addresses-table th,
.ip-addresses-table td {
  padding: 12px;
  border-bottom: 1px solid #dddddd;
  text-align: left;
}

.ip-addresses-table th {
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
