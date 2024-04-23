<template>
  <v-app id="inspire">
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>SDN Controller</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
  <v-list>
    <!-- Dashboard Page Link -->
    <v-list-item to="/dashboard" v-slot="{ navigate }" @click="navigate">
      <v-list-item-icon>
        <v-icon>mdi-view-dashboard</v-icon>
      </v-list-item-icon>
      <v-list-item-title>Dashboard</v-list-item-title>
    </v-list-item>

    <!-- Interfaces Page Link -->
    <v-list-item to="/interfaces" v-slot="{ navigate }" @click="navigate">
      <v-list-item-icon>
        <v-icon>mdi-ethernet-cable</v-icon>
      </v-list-item-icon>
      <v-list-item-title>Interfaces</v-list-item-title>
    </v-list-item>

    <!-- Security Profiles Page Link -->
    <v-list-item to="/security-profiles" v-slot="{ navigate }" @click="navigate">
      <v-list-item-icon>
        <v-icon>mdi-lock</v-icon>
      </v-list-item-icon>
      <v-list-item-title>Security Profiles</v-list-item-title>
    </v-list-item>

    <!-- Wireless Networks Page Link -->
    <v-list-item to="/wireless-networks" v-slot="{ navigate }" @click="navigate">
      <v-list-item-icon>
        <v-icon>mdi-wifi</v-icon>
      </v-list-item-icon>
      <v-list-item-title>Wireless Networks</v-list-item-title>
    </v-list-item>

    <!-- Static Routes Page Link -->
    <v-list-item to="/static-routes" v-slot="{ navigate }" @click="navigate">
      <v-list-item-icon>
        <v-icon>mdi-road</v-icon>
      </v-list-item-icon>
      <v-list-item-title>Static Routes</v-list-item-title>
    </v-list-item>

    <!-- IP Addresses Page Link -->
    <v-list-item to="/ip-addresses" v-slot="{ navigate }" @click="navigate">
      <v-list-item-icon>
        <v-icon>mdi-numeric</v-icon>
      </v-list-item-icon>
      <v-list-item-title>IP Addresses</v-list-item-title>
    </v-list-item>

    <!-- DHCP Servers Page Link -->
    <v-list-item to="/dhcp-servers" v-slot="{ navigate }" @click="navigate">
      <v-list-item-icon>
        <v-icon>mdi-server</v-icon>
      </v-list-item-icon>
      <v-list-item-title>DHCP Servers</v-list-item-title>
    </v-list-item>

    <!-- DNS Server Page Link -->
    <v-list-item to="/dns-server" v-slot="{ navigate }" @click="navigate">
      <v-list-item-icon>
        <v-icon>mdi-dns</v-icon>
      </v-list-item-icon>
      <v-list-item-title>DNS Server</v-list-item-title>
    </v-list-item>
  </v-list>

  <!-- VPN Page Link-->
  <v-list-item to="/vpn" v-slot="{ navigate }" @click="navigate">
    <v-list-item-icon>
      <v-icon>mdi-vpn</v-icon>
    </v-list-item-icon>
    <v-list-item-title>VPN</v-list-item-title>
  </v-list-item>
</v-navigation-drawer>


    <v-main class="bg-grey-lighten-2">
      <router-view></router-view> <!-- This will render the content of the current route -->
    </v-main>
  </v-app>
</template>

<script setup>
  import { ref } from 'vue'

  const drawer = ref(null)
</script>
