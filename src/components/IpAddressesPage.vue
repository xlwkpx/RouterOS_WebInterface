<template>
  <div class="container">
    <h1>IP Addresses</h1>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else>
      <table class="ip-addresses-table">
        <thead>
          <tr>
            <th>Ip Address</th>
            <th>Interface</th>
            <th>Network</th>
            <th></th>
            <th></th>
            <!-- Add more columns as needed -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(address, index) in ipAddresses" :key="index">
           <td>{{ address.address || '-' }}</td>
            <td>{{ address["interface"] || '-' }}</td>
            <td>{{ address['network'] || '-' }}</td>
            <!-- Add more columns as needed -->
            <td>
            <button @click="EditarIp(address)"> Editar</button>
          </td>
          <td>
            <button @click="EliminarIp(address)"> Eliminar</button>
          </td>
          </tr>


        </tbody>
      </table>
      <div class="add-button">
        <v-btn @click="showAddAddressModal = true">Add new IP Address</v-btn>
      </div>
    </div>


    <v-dialog v-model="showAddAddressModal" max-width="800px">
      <template v-slot:activator="{ on }"></template>
      <v-card>
        <v-card-title v-if="!editModal">Add Address</v-card-title>
        <v-card-title v-else>Edit Address</v-card-title>
          <v-card-text>
            <!-- Form for adding a new security profile -->
            <v-select
              v-model="newAddress.interface"
              :items="networkInterfaces"
              label="Interface"
              outlined
              dense
            ></v-select>
            <v-text-field v-model="newAddress['address']" label="Address"></v-text-field>
            <v-text-field v-model="newAddress['network']" label="Network"></v-text-field>
          </v-card-text>
        <v-card-actions>
          <!-- Button to cancel adding profile -->
          <v-btn @click="cancelAddAddress">Cancel</v-btn>
          <!-- Button to save the new profile -->
          <v-btn v-if="!editModal" color="primary" @click="saveNewAddress">Save</v-btn>
          <v-btn v-else color="primary" @click="saveEditAddress">Edit</v-btn>
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


const getIpAddresses = async () => {
  try {
    const response = await fetch('/rest/ip/address', {
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
    return responseData;
  } catch (error) {
    console.error('Error fetching IP addresses:', error);
    return [];
  }
};
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

export default {
  setup() {
    const router = useRouter();
    const ipAddresses = ref([]);
    const loading = ref(true);
    const addProfileModal = ref(false);
    const showAddAddressModal = ref(false);
    const editModal = ref(false);
    const networkInterfaces = ref([]);
    const selectedIp = ref(null);


    const newAddress = ref({
        "address":"",
        "comment":null,
        "disabled":"false",
        "interface":"",
        "network":""

    });

    function EditarIp(address) {
      selectedIp.value = address['.id'];

      console.log(address);

      newAddress.value.interface = address.interface;
      newAddress.value.address = address.address;
      newAddress.value.network = address.network;
      editModal.value = true;
      showAddAddressModal.value = true;

    };


    const cancelAddAddress = () => {
      showAddAddressModal.value = false;
      editModal.value = false;
      newAddress.value.interface = '';
      newAddress.value.address = '';
      newAddress.value.network = '';
    };

    async function EliminarIp(address) {
      const response = await fetch('/rest/ip/address/'+address['.id'], {
        method: "DELETE",
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Basic ${basicAuth}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to delete IP address');
      }
      ipAddresses.value = await getIpAddresses();

    };

    const saveNewAddress = async () => {
      try {
        const response = await fetch('/rest/ip/address', {
          method: "PUT",
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Basic ${basicAuth}`
          },
          body: JSON.stringify(newAddress.value)
        });
        if (!response.ok) {
          throw new Error('Failed to save new IP address');
        }
        ipAddresses.value = await getIpAddresses();
        showAddAddressModal.value = false;

        newAddress.interface = '';
        newAddress.address = '';
        newAddress.network = '';
      } catch (error) {
        console.error('Error saving new IP address:', error);
      }
    };

    const saveEditAddress = async () => {
      try {
        const response = await fetch(`/rest/ip/address/${selectedIp.value}`, {
          method: "PATCH",
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Basic ${basicAuth}`
          },
          body: JSON.stringify({
            "address": newAddress.value.address,
            "interface": newAddress.value.interface,
            "network": newAddress.value.network
          })
        });
        if (!response.ok) {
          throw new Error('Failed to save edited IP address');
        }
        ipAddresses.value = await getIpAddresses();
        showAddAddressModal.value = false;
        editModal.value = false;
        newAddress.value.interface = '';
        newAddress.value.address = '';
        newAddress.value.network = '';
      } catch (error) {
        console.error('Error saving edited IP address:', error);
      }
    };



    onMounted(async () => {
      try {
        ipAddresses.value = await getIpAddresses();
        networkInterfaces.value = await getInterfaces();
      } catch (error) {
        console.error('Error:', error);
      } finally {
        loading.value = false;
      }
    });

    const goToDashboard = () => {
      router.push('/dashboard');
    };

    return { ipAddresses, loading, goToDashboard , newAddress, showAddAddressModal, saveNewAddress, networkInterfaces, EditarIp, EliminarIp , selectedIp, editModal, cancelAddAddress
    , saveEditAddress};
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
