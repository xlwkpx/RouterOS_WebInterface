<template>
  <div class="container">
    <h1>Static Routes</h1>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else>
      <table class="static-routes-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>DHCP</th>
            <th>Distance</th>
            <th>Destination Address</th>
            <th>Dynamic</th>
            <th>Gateway</th>
            <th>Inactive</th>
            <th>Routing Table</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(route, index) in staticRoutes" :key="index">
            <td>{{ route['.id'] || '-' }}</td>
            <td>{{ route.dhcp || '-' }}</td>
            <td>{{ route.distance || '-' }}</td>
            <td>{{ route['dst-address'] || '-' }}</td>
            <td>{{ route.dynamic || '-' }}</td>
            <td>{{ route.gateway || '-' }}</td>
            <td>{{ route.inactive || '-' }}</td>
            <td>{{ route['routing-table'] || '-' }}</td>
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

const getStaticRoutes = async () => {
  try {
    const response = await fetch('/rest/ip/route', {
      method: "GET",
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Basic ${basicAuth}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch static routes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching static routes:', error);
    return [];
  }
};

export default {
  setup() {
    const router = useRouter();
    const staticRoutes = ref([]);
    const loading = ref(true);

    onMounted(async () => {
      try {
        staticRoutes.value = await getStaticRoutes();
      } catch (error) {
        console.error('Error:', error);
      } finally {
        loading.value = false;
      }
    });

    const goToDashboard = () => {
      router.push('/dashboard');
    };

    return { staticRoutes, loading, goToDashboard };
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

.static-routes-table {
  width: 90%;
  border-collapse: collapse;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-bottom: 20px;
}

.static-routes-table th,
.static-routes-table td {
  padding: 12px;
  border-bottom: 1px solid #dddddd;
  text-align: left;
}

.static-routes-table th {
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
