<template>
  <v-main class="bg-grey-lighten-2">
    <div class="container">
      <!-- Título "DNS Server" -->
      <h1 >DNS Server</h1>
      <div v-if="loading" class="loading">Loading...</div>
      <!-- Tabela com os endereços IP -->
      <div>
      <table v-if="!loading" class="interface-table">
        <thead>
          <tr>
            <th>Address</th>
            <th>Name</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="dns in dnsServer" :key="dns.id">
            <td>{{ dns.address }}</td>
            <td>{{ dns.name }}</td>
            <td>
              <button @click="openEditDialog(dns)">Config</button>
            </td>
            <td>
              <button v-if="dns.disabled='true'" @click="toggleStatus(dns)">Deactivate</button>
              <button v-else @click="toggleStatus(dns)">Activate</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>


      <v-dialog v-model="showDialog" max-width="800px">
        <v-card>
          <v-card-title >Config DNS Server</v-card-title>
            <v-card-text>
              <!-- Form for adding a new security profile -->
              <v-text-field v-model="DnsServer.address" label="Address"></v-text-field>
              <v-text-field v-model="DnsServer.name" label="Name"></v-text-field>
            </v-card-text>
          <v-card-actions>
            <!-- Button to cancel adding profile -->
            <v-btn @click="cancel">Cancel</v-btn>
            <!-- Button to save the new profile -->
            <v-btn color="primary" @click="saveDnsServer">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Botão para voltar ao Dashboard -->
      <div class="footer">
        <v-btn @click="goToDashboard">Back to Dashboard</v-btn>
      </div>
    </div>
  </v-main>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';


export default {
  setup() {
    const router = useRouter();
    const loading = ref(true);
    const dnsServer = ref([]);
    const dnsStatus = ref();
    const showDialog = ref(false);
    const editModal = ref(false);
    const username = 'admin';
    const password = '12345';
    const basicAuth = btoa(`${username}:${password}`);
    const DnsServer = ref({
      id: '',
      address: '',
      name: '',
    });

    async function getDnsServer() {
      const response = await fetch('/rest/ip/dns/static', {
        headers: {
          'Authorization': `Basic ${basicAuth}`
        }
      });
      const data = await response.json();

      console.log(data);
      return data;
    }

    async function toggleStatus(dns) {

      const response = await fetch(`/rest/ip/dns/static/${dns[".id"]}`, {
        method: "PUT",
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Basic ${basicAuth}`
        },
        body: JSON.stringify({
          "disabled": !dns.disabled,
        })
      });

      dnsServer.value = await getDnsServer();
    }

    const openEditDialog = (dns) => {
      showDialog.value = true;
      DnsServer.value.id = dns[".id"];
      DnsServer.value.address = dns.address;
      DnsServer.value.name = dns.name;
    };


    const saveDnsServer = async () => {

      await fetch('/rest/ip/dns/static/'+DnsServer.value.id, {
        method: "PUT",
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Basic ${basicAuth}`
        },
        body: JSON.stringify({
          "address": DnsServer.value.address,
          "name": DnsServer.value.name,
        })
      });

      dnsServer.value = await getDnsServer();
      cancel();
    };

    const cancel = () => {
      showDialog.value = false;
      DnsServer.value = {
        id: '',
        address: '',
        name: '',
      };
    };

    const goToDashboard = () => {
      router.push('/dashboard');
    };

    onMounted(async () => {
      dnsServer.value = await getDnsServer();
      loading.value = false;
    });

    return { goToDashboard, loading, dnsServer, getDnsServer, showDialog, editModal, DnsServer, openEditDialog, toggleStatus, saveDnsServer , dnsStatus, cancel};
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
