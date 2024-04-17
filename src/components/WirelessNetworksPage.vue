<template>
  <v-main class="bg-grey-lighten-2">
    <v-container>
      <!-- Título "Wireless Networks" -->
      <h1 class="page-title">Wireless Networks</h1>

      <!-- Conteúdo da página das Wireless Networks -->
      <v-row>
        <!-- Conteúdo das Wireless Networks -->
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
  methods: {
    goToDashboard() {
      // Redirecionar para a rota do Dashboard
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
