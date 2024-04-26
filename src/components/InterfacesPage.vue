<template>
  <div class="container">
    <h1>Network Interfaces</h1>
    <div class="filter">
      <label for="interface-filter" style="color: black;">Filter by type:</label>
      <select id="interface-filter" v-model="selectedFilter" class="custom-dropdown" style="color: black;">
        <option value="all">All Interfaces</option>
        <option value="wlan">Wireless</option>
        <option value="bridge">Bridge</option>
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
            <th>Ports</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(networkInterface, index) in filteredInterfaces" :key="index">
            <td>{{ networkInterface.name }}</td>
            <td>{{ networkInterface.type }}</td>
            <td>{{ networkInterface.mtu }}</td>
            <td>{{ networkInterface.running }}</td>
            <td>{{ networkInterface['mac-address'] }}</td>
            <div v-if="selectedFilter === 'bridge'">
              <td>
                {{ getInterfacePorts(networkInterface) }}
              </td>
              <td>
                <button @click="editBridgeInterface(networkInterface)">Edit</button>
              </td>
              <td>
                <button @click="deleteBridgeInterface(networkInterface)">Delete</button>
              </td>
            </div>
          </tr>
        </tbody>
      </table>
      <div v-if="selectedFilter === 'bridge'" style="display: flex; margin-top: 7px;">
        <v-btn @click="createBridgeInterface">Create Bridge Interface</v-btn>
      </div>
    </div>

    <!-- Dialog for adding/editing bridge interface -->
    <v-dialog v-model="showDialogBridge" max-width="800px">
      <template v-slot:activator="{ on }"></template>
      <v-card>
        <v-card-title v-if="!editModal">Add Address</v-card-title>
        <v-card-title v-else>Edit Address</v-card-title>
        <v-card-text>
          <!-- Form for adding a new bridge interface -->
          <v-text-field v-model="newBridgeInterface.name" label="Name"></v-text-field>
          <v-select
            v-model="newBridgeInterface.arp"
            :items="bridgeArpOptions"
            label="ARP"
            outlined
            dense
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <!-- Button to cancel adding/editing bridge interface -->
          <v-btn @click="cancel">Cancel</v-btn>
          <!-- Button to save the new bridge interface -->
          <v-btn v-if="!editModal" color="primary" @click="saveNewBridge">Save</v-btn>
          <v-btn v-else color="primary" @click="saveEditBridge">Edit</v-btn>
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
import { all } from 'axios';
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
    const showDialogBridge = ref(false);
    const editModal = ref(false);
    const bridgeArpOptions = ref(["enabled", "disabled", "local-proxy-arp", "reply-only","proxy-arp"]);
    const allPorts = ref([]);
    const selectedBridgeInterface = ref(null);

    const filteredInterfaces = computed(() => {
      if (selectedFilter.value === "all") {
        return networkInterfaces.value;
      } else {
        return networkInterfaces.value.filter(iface => iface.type === selectedFilter.value);
      }
    });

    const newBridgeInterface = ref({
        "name": "",
        "ageing-time": "5m",
        "arp": "",
        "arp-timeout": "auto",
        "auto-mac": "true",
        "dhcp-snooping": "false",
        "disabled": "false",
        "fast-forward": "true",
        "forward-delay": "15s",
        "igmp-snooping": "false",
        "max-message-age": "20s",
        "mtu": "auto",
        "priority": "0x8000",
        "protocol-mode": "rstp",
        "transmit-hold-count": "6",
        "vlan-filtering": "false"

    });

    const cancel = () => {
      showDialogBridge.value = false;
      editModal.value = false;
      newBridgeInterface.name = '';
      newBridgeInterface.arp = '';
    };

    const createBridgeInterface = () => {
      editModal.value = false;
      showDialogBridge.value = true;
    };

    const editBridgeInterface = async (bridgeInterface) => {
      selectedBridgeInterface.value = bridgeInterface['id'];

      const response = await fetch(`/rest/interface/bridge/`+selectedBridgeInterface.value, {
          method: "GET",
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Basic ${basicAuth}`
          }
        })
        .then(response => response.json());
      editModal.value = true;
      showDialogBridge.value = true;
      newBridgeInterface.value.name = response.name;
      newBridgeInterface.value.arp = response['arp'];
    };

    const deleteBridgeInterface = async (bridgeInterface) => {
      try {
        const response = await fetch(`/rest/interface/bridge/${bridgeInterface['name']}`, {
          method: "DELETE",
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Basic ${basicAuth}`
          }
        });
        if (response.ok) {
          networkInterfaces.value = await getInterfaces();
        } else {
          console.error('Error deleting bridge interface:', response.statusText);
        }
      } catch (error) {
        console.error('Error deleting bridge interface:', error);
      }
    };

    async function getAllPorts() {
      const response = await fetch(`/rest/interface/bridge/port`, {
        method: "GET",
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Basic ${basicAuth}`
        }
      });
      const data = await response.json();
      allPorts.value = data;
    }

     function getInterfacePorts(bridgeInterface) {
      const ports = allPorts.value.filter(port => port['bridge'] === bridgeInterface['name']);
      return ports != '' ? ports.map(port => port['interface']).join(', ') : '-';
    }


    const saveEditBridge = async () => {
      try {
        const response = await fetch(`/rest/interface/bridge/`+selectedBridgeInterface.value, {
          method: "PATCH",
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Basic ${basicAuth}`
          },
          body: JSON.stringify({
            "name": newBridgeInterface.value.name,
            "arp": newBridgeInterface.value.arp

          })
        });
        if (response.ok) {
          showDialogBridge.value = false;
          editModal.value = false;
          networkInterfaces.value = await getInterfaces();
          networkInterfaces.value.name = '';
          networkInterfaces.value.arp = '';
        } else {
          console.error('Error editing bridge interface:', response.statusText);
        }
      } catch (error) {
        console.error('Error editing bridge interface:', error);
      }
    };

    const saveNewBridge = async () => {
      try {
        const response = await fetch('/rest/interface/bridge', {
          method: "PUT",
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Basic ${basicAuth}`
          },
          body: JSON.stringify(newBridgeInterface.value)
        });
        if (response.ok) {
          showDialogBridge.value = false;
          editModal.value = false;
          networkInterfaces.value = await getInterfaces();
          networkInterfaces.value.name = '';
          networkInterfaces.value.arp = '';
        } else {
          console.error('Error creating bridge interface:', response.statusText);
        }
      } catch (error) {
        console.error('Error creating bridge interface:', error);
      }
    };

    onMounted(async () => {
      try {
        const data = await getInterfaces();
        getAllPorts();
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

    return { networkInterfaces, loading, selectedFilter, filteredInterfaces, goToDashboard , createBridgeInterface, editBridgeInterface, deleteBridgeInterface, showDialogBridge, newBridgeInterface, saveNewBridge, editModal, bridgeArpOptions, cancel,
    saveEditBridge, selectedBridgeInterface, getInterfacePorts, allPorts, getAllPorts};
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
