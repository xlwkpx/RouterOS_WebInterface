<template>
  <div class="container">
    <h1>DHCP Servers</h1>
    <div class="filter">
    </div>
    <div>
      <table class="interface-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Interface</th>
            <th>Address Pool</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="dhcpServer in dhcpServers" :key="index">
            <td>{{ dhcpServer.name }}</td>
            <td>{{ dhcpServer.interface }}</td>
            <td>{{ dhcpServer["address-pool"] }}</td>
            <td>
              <button @click="openEditDialog(dhcpServer)">Edit</button>
            </td>
            <td>
              <button @click="deleteDhcpServer(dhcpServer)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <v-btn @click="openDialog">Create DHCP Server</v-btn>
      </div>
  </div>
  <!-- Button to go back to Dashboard -->
      <div class="footer">
          <v-btn @click="goToDashboard">Back to Dashboard</v-btn>
      </div>
  </div>

  <!-- pop up-->
  <v-dialog v-model="showDialog" max-width="800px">
    <template v-slot:activator="{ on }"></template>
    <v-card>
      <v-card-title v-if="!editModal">Add DHCP Server</v-card-title>
      <v-card-title v-else>Edit DHCP Server</v-card-title>
        <v-card-text>
          <!-- Form for adding a new security profile -->
          <v-text-field v-model="newDhcpServer.name" label="Name"></v-text-field>
          <v-select
              v-model="newDhcpServer.interface"
              :items="networkInterfaces"
              label="Interface"
              outlined
              dense
            ></v-select>
            <v-text-field v-model="newDhcpServer['address-pool']" label="Address Pool"></v-text-field>
        </v-card-text>
      <v-card-actions>
        <!-- Button to cancel adding profile -->
        <v-btn @click="cancel">Cancel</v-btn>
        <!-- Button to save the new profile -->
        <v-btn v-if="!editModal" color="primary" @click="createDhcpServer">Save</v-btn>
        <v-btn v-else color="primary" @click="editDhcpServer">Edit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>


</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter from vue-router



const username = 'admin';
const password = '12345';
const basicAuth = btoa(`${username}:${password}`);

const getDHCPservers = async () => {
  try {
    const response = await fetch('/rest/ip/dhcp-server', {
      method: "GET",
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Basic ${basicAuth}`
      }
    });
    return await response.json();

  } catch (error) {
    console.error('Error fetching security profiles:', error);
    return [];
  }
};

export default {
  setup() {
    const router = useRouter(); // Use useRouter to access the router instance
    const dhcpServers = ref([]);
    const showDialog = ref(false);
    const editModal = ref(false);
    const selectedDhcpServer = ref(null);
    const networkInterfaces = ref([]);
    const newDhcpServer = ref({
      name: '',
      interface: '',
      "address-pool": '',
    });

    const openDialog = () => {
      showDialog.value = true;
      newDhcpServer.value = {
        name: '',
        interface: '',
        "address-pool": '',
      };
    };

    const openEditDialog = (dhcpServer) => {
      selectedDhcpServer.value = dhcpServer;
      showDialog.value = true;
      newDhcpServer.value.name = dhcpServer.name;
      newDhcpServer.value.interface = dhcpServer.interface;
      newDhcpServer.value["address-pool"] = dhcpServer["address-pool"];
      editModal.value = true;
    };


    async function createDhcpServer() {
      try {
        const response = await fetch('/rest/ip/dhcp-server', {
          method: "PUT",
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Basic ${basicAuth}`
          },
          body: JSON.stringify({
            name: newDhcpServer.value.name,
            interface: newDhcpServer.value.interface,
            "address-pool": newDhcpServer.value["address-pool"],
            "lease-time": "10m",
            "disabled": "true",
          })

        });
        if (response.ok) {
          const data = await response.json();
          dhcpServers.value.push(data);
          cancel();
        }
      } catch (error) {
        console.error('Error creating DHCP server:', error);
      }
    }

    const cancel = () => {
      showDialog.value = false;
      editModal.value = false;
      newDhcpServer.value = {
        name: '',
        interface: '',
        "address-pool": '',
      };
    };


    async function deleteDhcpServer(dhcpServer) {
      try {
        const response = await fetch(`/rest/ip/dhcp-server/${dhcpServer[".id"]}`, {
          method: "DELETE",
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Basic ${basicAuth}`
          }
        });
        if (response.ok) {
          dhcpServers.value = await getDHCPservers();

        }
      } catch (error) {
        console.error('Error deleting DHCP server:', error);
      }
    }

    async function editDhcpServer() {
      try {
        const response = await fetch(`/rest/ip/dhcp-server/${selectedDhcpServer.value[".id"]}`, {
          method: "PUT",
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Basic ${basicAuth}`
          },
          body: JSON.stringify(newDhcpServer.value)
        });
        if (response.ok) {
          dhcpServers.value = await getDHCPservers();
          cancel();
        }
      } catch (error) {
        console.error('Error updating DHCP server:', error);
      }

    }
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
        // Mapeie os dados para extrair apenas os nomes das interfaces de rede
        const interfaceNames = responseData.map(data => data.name);
        return interfaceNames;
      })
      .catch(error => {
        console.error('Error fetching network interfaces:', error);
        return [];
      });
    };



    onMounted(async () => {
      networkInterfaces.value = await getInterfaces()
      try {
        const data = await getDHCPservers();
        dhcpServers.value = data;
      } catch (error) {
        console.error('Error:', error);
      }
    });

    const goToDashboard = () => {
      // Redirect to the Dashboard route using the router instance
      router.push('/dashboard');
    };

    return { dhcpServers, deleteDhcpServer,editDhcpServer, goToDashboard, createDhcpServer, showDialog, openDialog,
      newDhcpServer, cancel, openEditDialog, editModal, selectedDhcpServer, networkInterfaces};

  },



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
