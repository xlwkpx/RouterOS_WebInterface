// Import necessary modules
import { createRouter, createWebHistory } from 'vue-router'

// Import your components
import DashboardPage from '@/components/DashboardPage.vue'
import InterfacesPage from '@/components/InterfacesPage.vue'
import SecurityProfilesPage from '@/components/SecurityProfilesPage.vue'
import WirelessNetworksPage from '@/components/WirelessNetworksPage.vue'
import StaticRoutesPage from '@/components/StaticRoutesPage.vue'
import IpAddressesPage from '@/components/IpAddressesPage.vue'
import DhcpServersPage from '@/components/DhcpServersPage.vue'
import DnsServerPage from '@/components/DnsServerPage.vue'

const routes = [
  {
    path: '/dashboard',
    component: DashboardPage,
    name: 'DashboardPage'
  },
  {
    path: '/interfaces',
    component: InterfacesPage,
    name: 'Interfaces'
  },
  {
    path: '/security-profiles',
    component: SecurityProfilesPage,
    name: 'SecurityProfiles'
  },
  {
    path: '/wireless-networks',
    component: WirelessNetworksPage,
    name: 'WirelessNetworks'
  },
  {
    path: '/static-routes',
    component: StaticRoutesPage,
    name: 'StaticRoutes'
  },
  {
    path: '/ip-addresses',
    component: IpAddressesPage,
    name: 'IpAddresses'
  },
  {
    path: '/dhcp-servers',
    component: DhcpServersPage,
    name: 'DhcpServers'
  },
  {
    path: '/dns-server',
    component: DnsServerPage,
    name: 'DnsServer'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
