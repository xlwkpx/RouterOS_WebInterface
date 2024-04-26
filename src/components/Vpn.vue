<template>
  <v-main class="bg-grey-lighten-2">
    <v-container>
      <!-- Título "vpn" -->
      <h1 class="page-title">VPN</h1>

      <!-- Tabela com as VPNs -->
      <div>
        <table v-if="!loading" class="interface-table">
          <thead>
            <tr>
              <th>Interface</th>
              <th>Allowed Address</th>
              <th>Public Key</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="vpn in allVPN" :key="vpn['.id']">
              <td>{{ vpn.interface }}</td>
              <td>{{ vpn['allowed-address'] }}</td>
              <td>{{ vpn['public-key'] }}</td>
              <td>
                <button @click="openEditDialog(vpn)">Edit</button>
              </td>
              <td>
                <button @click="deleteVPN(vpn)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>

        <v-btn @click="openDialog" style="margin-top: 3px;">Create Peer</v-btn>
      </div>


      <v-dialog v-model="showDialog" max-width="800px">
        <v-card>
          <v-card-title>{{editModal ? "Edit VPN" : "Criar VPN"}}</v-card-title>
          <v-card-text>
            <!-- Form for adding a new VPN -->
            <div v-if="editModal">
              <v-text-field v-model="newVPN.interface" label="Interface" readOnly></v-text-field>
              <v-text-field v-model="newVPN['allowed-address']" label="Allowed Address" readOnly></v-text-field>
            </div>
            <div v-else>
              <v-text-field v-model="newVPN.interface" label="Interface"></v-text-field>
              <v-text-field v-model="newVPN['allowed-address']" label="Allowed Address"></v-text-field>
            </div>
            <v-text-field v-model="newVPN['public-key']" label="Public Key"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <!-- Button to cancel adding VPN -->
            <v-btn @click="cancel">Cancel</v-btn>
            <!-- Button to save the new VPN -->
            <v-btn v-if="editModal" color="primary" @click="saveVPN">Save</v-btn>
            <v-btn v-else color="primary" @click="createPeer">Create</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>


      <!-- Botão para voltar ao Dashboard -->
      <div class="footer">
        <v-btn @click="goToDashboard">Back to Dashboard</v-btn>
      </div>
    </v-container>
  </v-main>
</template>



<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';


export default {
  setup() {
    const router = useRouter(); // Create a router object using useRouter
    const loading = ref(true);
    const dnsServer = ref([]);
    const dnsStatus = ref();
    const showDialog = ref(false);
    const editModal = ref(false);
    const username = 'admin';
    const password = '12345';
    const basicAuth = btoa(`${username}:${password}`);
    const allVPN = ref([]);
    const newVPN = ref({
      interface: "",
      "allowed-address": "",
      "public-key": ""
    });
    const selectedVPN = ref(null);

    async function getVPN(){
      const response = await fetch('/rest/interface/wireguard/peers', {
        headers: {
          'Authorization': `Basic ${basicAuth}`
        }
      });
      const data = await response.json();

      console.log(data);
      return data;
    }

    async function createPeer(){
      const response = await fetch('/rest/interface/wireguard/peers', {
        method: "PUT",
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Basic ${basicAuth}`
        },
        body: JSON.stringify({
          "interface": newVPN.value.interface,
          "allowed-address": newVPN.value["allowed-address"],
          "public-key": newVPN.value["public-key"],
        })

      });

      allVPN.value = await getVPN();
      cancel();}


     async function editVPN(vpn){
      editModal.value = true;
      selectedVPN.value = vpn;
      console.log(vpn);
    }


    async function deleteVPN(vpn){
      const response = await fetch(`/rest/interface/wireguard/peers/${vpn[".id"]}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Basic ${basicAuth}`
        }
      });
      allVPN.value = await getVPN();
    }


    const openEditDialog = (vpn) => {
      showDialog.value = true;
      editModal.value = true;
      newVPN.value.interface = vpn.interface;
      newVPN.value["allowed-address"] = vpn["allowed-address"];
      newVPN.value["public-key"] = vpn["public-key"];
    };

    const saveVPN = async () => {
      await fetch('/rest/interface/wireguard/peers', {
        method: "PUT",
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Basic ${basicAuth}`
        },
        body: JSON.stringify({
          interface: newVPN.value.interface,
          "allowed-address": newVPN.value["allowed-address"],
          "public-key": newVPN.value["public-key"]
        })
      });

      allVPN.value = await getVPN();
      cancel();
    }

    const openDialog = () => {
      showDialog.value = true;
      editModal.value = false;
      newVPN.value = {
        interface: "",
        "allowed-address": "",
        "public-key": ""
      };
    };



    const cancel = () => {
      showDialog.value = false;
      editModal.value = false;
      newVPN.value = {
        interface: "",
        "allowed-address": "",
        "public-key": ""
      };
    };

    const goToDashboard = () => {
      router.push('/dashboard');
    };

    onMounted(async () => {
      allVPN.value = await getVPN();
      loading.value = false;
    });

    return {
      loading,
      dnsServer,
      dnsStatus,
      showDialog,
      editModal,
      goToDashboard,
      allVPN,
      newVPN,
      createPeer,
      editVPN,
      deleteVPN,
      openEditDialog,
      saveVPN,
      cancel,
      showDialog,
      openDialog,

    };
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

.toggle-button {
  background: #F00;
  padding: 5px .5em;
}
</style>
