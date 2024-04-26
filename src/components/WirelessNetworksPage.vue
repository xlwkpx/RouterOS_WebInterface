<template>
  <v-main class="bg-grey-lighten-2">
    <v-container>
      <!-- Título "Wireless Networks" -->

      <h1>Wireless Networks</h1>
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else>
        <table class="wireless-networks-table">
          <thead>
            <tr>
              <th>name</th>
              <th>ssid</th>
              <th>master-interface</th>
              <th>mode</th>
              <th>mtu</th>
              <th>security-profile</th>
              <th></th>
              <!-- Add more columns as needed -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="(network) in networks" :key="network['.id']">
              <td>{{ network.name }}</td>
              <td>{{ network.ssid }}</td>
              <td>{{ network['master-interface'] }}</td>
              <td>{{ network.mode }}</td>
              <td>{{ network.mtu }}</td>
              <td>{{ network['security-profile'] }}</td>
              <!-- Add more columns as needed -->
              <td>
                <button @click="toggleDisabled(network)"> {{ network.disabled == "true" ? 'Activate' : 'Deactivate'
                  }}</button> &nbsp;
                <button @click="toggleShowConfigureModal(network)"> Configure</button>
              </td>
            </tr>


          </tbody>
        </table>

      </div>
      <div class="footer">
        <v-btn @click="goToDashboard">Back to Dashboard</v-btn>
      </div>
    </v-container>


    <v-dialog v-model="showConfigureModal" max-width="800px">
      <template v-slot:activator="{ on }"></template>
      <v-card>
        <v-card-title>Configure Modal</v-card-title>
        <v-card-text>
          <!-- Form for adding a new security profile -->
          <v-select v-model="selectedNetwork['security-profile']"
          :items="securityProfiles" label="Security Profile" outlined
          item-title="name"
          item-value="name"
            dense>
          </v-select>
          <v-text-field v-model="selectedNetwork.ssid" label="SSID"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <!-- Button to cancel adding profile -->
          <v-btn @click="showConfigureModal=false">Cancel</v-btn>
          <!-- Button to save the new profile -->
          <v-btn color="primary" @click="saveConfiguration">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script>
const username = 'admin';
const password = '12345';
const basicAuth = btoa(`${username}:${password}`);
export default {
  data() {
    return {
      networks: [],
      loading: false,
      securityProfiles:[],
      showConfigureModal: false,
      selectedNetwork: null
    }
  },
  methods: {
    goToDashboard() {
      // Redirecionar para a rota do Dashboard
      this.$router.push('/dashboard');
    },
    async getWirelessNetworks() {
      try {
        const response = await fetch('/rest/interface/wireless', {
          method: "GET",
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Basic ${basicAuth}`
          }
        });
        console.log("*****************************");
        this.networks = await response.json();
        console.log(this.networks)

      } catch (error) {
        console.error('Error fetching network interfaces:', error);
        return [];
      }
    },
    async toggleDisabled(network) {
      try {
        const response = await fetch(`/rest/interface/wireless/${network['.id']}`, {
          method: "PUT",
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Basic ${basicAuth}`
          },
          body: {
            disabled: network.disabled == "true" ? false : true
          }
        });
        console.log("*****************************");
        console.log(await response.json())
        this.getWirelessNetworks()

      } catch (error) {
        console.error('Error modifiying network :', error);
        return [];
      }
    },
    async getSecurityProfiles() {
      try {
        const response = await fetch('/rest/interface/wireless/security-profiles', {
          method: "GET",
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Basic ${basicAuth}`
          }
        });
        this.securityProfiles = await response.json();


      } catch (error) {
        console.error('Error fetching security profiles:', error);
        return [];
      }
    },
    toggleShowConfigureModal(network) {
      this.selectedNetwork = network
      this.showConfigureModal = !this.showConfigureModal
    },
    async saveConfiguration(){
      console.log('In save config ....')
      console.log(this.selectedNetwork);
      try {
        const response = await fetch(`/rest/interface/wireless/${this.selectedNetwork['.id']}`, {
          method: "PUT",
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Basic ${basicAuth}`
          },
          body: JSON.stringify({
            "ssid": this.selectedNetwork.ssid,
            "security-profile": this.selectedNetwork['security-profile']
          })
        });
        console.log("*****************************");
        console.log(await response.json())
        this.getWirelessNetworks()

      } catch (error) {
        console.error('Error configuring network :', error);
        return [];
      }
    }
  },
  async mounted() {
    this.getWirelessNetworks()
    await this.getSecurityProfiles()
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

.wireless-networks-table {
  width: 90%;
  border-collapse: collapse;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-bottom: 20px;
}

.wireless-networks-table th,
.wireless-networks-table td {
  padding: 12px;
  border-bottom: 1px solid #dddddd;
  text-align: left;
}

.wireless-networks-table th {
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

.add-button {
  margin-bottom: 20px;
}
</style>
