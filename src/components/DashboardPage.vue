<template>
  <v-main class="bg-grey-lighten-2">
    <v-container>
      <v-row>
        <v-col cols="12" md="4" lg="3" v-for="page in pages" :key="page.name">
          <router-link :to="page.path" class="page-link">
            <v-icon class="page-icon">{{ page.icon }}</v-icon>
            <span class="page-name">{{ page.name }}</span>
          </router-link>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref } from 'vue';

const pages = ref([
  { name: 'Interfaces', path: '/interfaces', icon: 'mdi-ethernet-cable' },
  { name: 'Security Profiles', path: '/security-profiles', icon: 'mdi-lock' },
  { name: 'Wireless Networks', path: '/wireless-networks', icon: 'mdi-wifi' },
  { name: 'Static Routes', path: '/static-routes', icon: 'mdi-road' },
  { name: 'IP Addresses', path: '/ip-addresses', icon: 'mdi-numeric' },
  { name: 'DHCP Servers', path: '/dhcp-servers', icon: 'mdi-server' },
  { name: 'DNS Server', path: '/dns-server', icon: 'mdi-dns' },
  { name: 'VPN', path: '/vpn', icon: 'mdi-vpn' }
]);
</script>

<style>
.page-link {
  text-decoration: none;
  color: inherit;
  text-align: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-icon {
  font-size: 64px !important;
}
</style>

