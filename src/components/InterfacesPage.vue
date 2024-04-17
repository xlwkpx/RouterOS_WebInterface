<template>
  <v-main class="bg-grey-lighten-2">
    <v-container>
      <!-- Título "Interfaces" -->
      <h1 class="page-title">Interfaces</h1>

      <!-- Conteúdo da página das interfaces -->
      <v-row>
        <!-- Table to display interface information -->
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>MTU</th>
                <th>Running</th>
                <th>Mac Address</th>
                <!-- Add more columns as needed -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="(networkInterface, index) in networkInterfaces" :key="index">
                <td>{{ networkInterface.name }}</td>
                <td>{{ networkInterface.type }}</td>
                <td>{{ networkInterface.mtu }}</td>
                <td>{{ networkInterface.running }}</td>
                <td>{{ networkInterface['mac-address'] }}</td>
                <!-- Add more columns as needed -->
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-row>

      <!-- Botão para voltar ao Dashboard -->
      <div class="footer">
        <v-btn @click="goToDashboard">Back to Dashboard</v-btn>
      </div>
    </v-container>
  </v-main>
</template>

<script>
export default {
  data() {
    return {
      networkInterfaces: [] // Initialize interfaces as an empty array
    };
  },
  created() {
    // Fetch interface data when the component is created
    this.fetchInterfaces();
  },
  methods: {
    async fetchInterfaces() {
      try {
        // Make an HTTP GET request to your API endpoint
        const response = await fetch('http://192.168.79.1/rest/interface', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic YWRtaW46MTIzNDU=', // Base64 encoded username:password
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Parse the JSON response
        const data = await response.json();

        // Update the interfaces data with the received data
        this.networkInterfaces = data;
      } catch (error) {
        console.error('Error fetching network interfaces:', error);
      }
    },
    goToDashboard() {
      // Redirect to the Dashboard route
      this.$router.push('/dashboard');
    }
  }
};
</script>

<style scoped>
.page-title {
  text-align: center;
  margin-bottom: 20px; /* Espaçamento abaixo do título */
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
}
</style>
