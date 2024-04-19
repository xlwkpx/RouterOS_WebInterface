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
            <th></th>
            <th></th>
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
            <td>
              <button @click="editRoute(route)">Edit</button>
            </td>
            <td>
              <button @click="deleteRoute(route)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="add-button">
        <v-btn @click="showAddRouteModal = true">Add Static Route</v-btn>
      </div>
    </div>


    <!-- Modal -->
    <v-dialog v-model="showAddRouteModal" max-width="800px">
      <template v-slot:activator="{ on }"></template>
      <v-card>
        <v-card-title v-if="!editModal" >Add Static Route</v-card-title>
        <v-card-title v-else>Edit Static Route</v-card-title>
        <v-card-text>
          <v-text-field v-model="newRoute['dst-address']" label="Destination Address"></v-text-field>
          <v-text-field v-model="newRoute.gateway" label="Gateway"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <!-- Button to cancel adding route -->
          <v-btn @click="cancel">Cancel</v-btn>
          <!-- Button to save the new route -->
          <v-btn v-if="!editModal" @click="addRoute">Save</v-btn>
          <v-btn v-else @click="editRouteSave">Edit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    const showAddRouteModal = ref(false);
    const selectedRoute = ref(null);
    const newRoute = ref({
      'dst-address': '',
      'gateway': ''
    });
    const editModal = ref(false);

    const cancel = () => {
      showAddRouteModal.value = false;
      editModal.value = false;
      newRoute.value = {
        'dst-address': '',
        'gateway': ''
      };
    };


    const addRoute = async () => {
      try {
        const response = await fetch('/rest/ip/route', {
          method: "PUT",
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Basic ${basicAuth}`
          },
          body: JSON.stringify(newRoute.value)
        });
        if (!response.ok) {
          throw new Error('Failed to add static route');
        }
        showAddRouteModal.value = false;
        staticRoutes.value = await getStaticRoutes();
        newRoute.value = {
          'dst-address': '',
          'gateway': ''
        };
      } catch (error) {
        console.error('Error adding static route:', error);
      }
    };

    const editRoute = (route) => {
      selectedRoute.value = route['.id'];
      newRoute.value.gateway = route.gateway;
      newRoute.value['dst-address'] = route['dst-address'];
      editModal.value = true;
      showAddRouteModal.value = true;
    };

    const editRouteSave = async () => {
      try {
        const response = await fetch(`/rest/ip/route/${selectedRoute.value}`, {
          method: "PATCH",
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Basic ${basicAuth}`
          },
          body: JSON.stringify(newRoute.value)
        });
        if (!response.ok) {
          throw new Error('Failed to edit static route');
        }
        showAddRouteModal.value = false;
        editModal.value=false;
        staticRoutes.value = await getStaticRoutes();
        newRoute.value = {
          'dst-address': '',
          'gateway': ''
        };
      } catch (error) {
        console.error('Error editing static route:', error);
      }
    };

    const deleteRoute = async (route) => {
      try {
        const response = await fetch(`/rest/ip/route/${route['.id']}`, {
          method: "DELETE",
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Basic ${basicAuth}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to delete static route');
        }
        staticRoutes.value = await getStaticRoutes();
      } catch (error) {
        console.error('Error deleting static route:', error);
      }
    };

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

    return { staticRoutes, loading, goToDashboard, showAddRouteModal, newRoute, addRoute, editModal, editRoute, deleteRoute,cancel, editRouteSave};
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
