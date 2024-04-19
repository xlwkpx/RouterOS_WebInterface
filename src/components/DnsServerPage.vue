<template>
  <v-main class="bg-grey-lighten-2">
    <div class="container">
      <!-- Título "DNS Server" -->
      <h1 >DNS Server</h1>
      <div v-if="loading" class="loading">Loading...</div>

      <!-- Conteúdo da página do DNS Server -->
      <v-row>
        <!-- Conteúdo do DNS Server -->
      </v-row>

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

const username = 'admin';
const password = '12345';
const basicAuth = btoa(`${username}:${password}`);

const getDnsServer = async () => {

};

export default {
  setup() {
    const router = useRouter();
    const loading = ref(true);



    const goToDashboard = () => {
      router.push('/dashboard');
    };

    onMounted(async () => {

      loading.value = false;
    });

    return { goToDashboard, loading};
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
