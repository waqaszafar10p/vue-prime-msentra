<template>
  <div class="layout-wrapper">
    <!-- Left Sidebar: 1/4 -->
    <aside class="sidebar">
      <div class="sidebar-inner">
        <!-- Logo -->
        <div class="logo-section">
          <Logo />
        </div>

        <!-- Office Section -->
        <div class="menu-section">
          <h3 class="menu-title">Office</h3>
          <PanelMenu :model="officeMenu" />
        </div>

        <!-- Others Section -->
        <div class="menu-section border-top">
          <h3 class="menu-title">Others</h3>
          <PanelMenu :model="othersMenu" />
        </div>
      </div>

    </aside>

     <!-- Right Area -->
     <main class="main-content">
      <!-- Top Bar -->
<div class="top-bar">
  <h2 class="page-title">{{ pageTitle }}</h2>

  <div class="profile-menu">
    <Menu ref="menu" :model="menuItems" :popup="true" appendTo="body" />
    <Avatar icon="pi pi-user" shape="circle" class="profile-avatar" @click="toggleMenu" />
  </div>
</div>

<!-- Main Content -->
<RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PanelMenu from 'primevue/panelmenu'
import Logo from '@/components/icons/Logo.vue'
import { logout } from '@/services/auth.service'
import Menu from 'primevue/menu'
import Avatar from 'primevue/avatar'

const router = useRouter()
const route = useRoute()
const isActive = (path: string) => route.path === path

// Used to show page title dynamically
const pageTitle = computed(() => {
  const name = route.name?.toString() || ''
  return name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
})

const officeMenu = ref([
  { label: 'Dashboard',
  command: () => router.push('/dashboard'), 
  class: isActive('/dashboard') ? 'menu-active' : '',
  icon: 'pi pi-th-large'
},
  { label: 'Clinic Schedule', icon: 'pi pi-calendar', command: () => router.push('/clinic-schedule'), class: isActive('/clinic-schedule') ? 'menu-active' : '' }
])

const othersMenu = ref([
  { label: 'Staff', icon: 'pi pi-chart-bar', command: () => router.push('/staff-profile'), class: isActive('/staff-profile') ? 'menu-active' : '' }
])

const menu = ref()
const toggleMenu = (event: Event) => {
  menu.value?.toggle(event)
}
const menuItems = ref([
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: () => logout()
  }
])

</script>

<style scoped>
.layout-wrapper {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 20%;
  min-width: 250px;
  background-color: #ffffff;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.sidebar-inner {
  padding: 1rem;
  overflow-y: auto;
}

.bottom-menu {
  padding: 1rem;
}

.main-content {
  width: 80%;
  padding: 2rem 4rem;
  overflow-y: auto;
  background-color: #f9f9f9;
}

.menu-title {
  font-size: 0.85rem;
  font-weight: bold;
  color: #666;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.logo-section {
  margin: 2rem 0;
}

.border-top {
  border-top: 1px solid #ccc;
  padding-top: 1rem;
  margin-top: 1rem;
}

.menu-section {
  margin-bottom: 1.5rem;
}
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0rem;
}

.page-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
}

/* Profile Menu and Avatar */
.profile-menu {
  position: relative;
}

/* Avatar Style */
.profile-avatar {
  cursor: pointer;
  background-color: #ffffff;
  color: #333;
  border: 1px solid #ccc;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
}

/* Override PrimeVue popup menu */
::v-deep(.p-menu) {
  background: #ffffff;
  color: #000000;
  border: 1px solid #ddd;
  min-width: 10rem;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* Menu item hover effect */
::v-deep(.p-menuitem-link:hover) {
  background-color: #f0f0f0;
  color: #000;
}

/* Icon color inside menu */
::v-deep(.p-menuitem-icon) {
  color: #666;
  margin-right: 0.5rem;
}
::v-deep(.p-menu) {
  margin-top: 0.5rem;
}
/* ⬛ Ensure the menu container has a white background and is aligned left */
::v-deep([data-pc-name="menu"]) {
  background-color: #fff;
  color: #000;
  border: 1px solid #ddd;
  border-radius: 6px;
  min-width: 10rem;
  padding: 0.5rem 0;
  list-style: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateX(-100%) !important; /* Push to the left of avatar */
}
::v-deep([data-pc-name="menu"] [data-pc-section="action"]:hover) {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  background-color: #f0f0f0; /* optional: subtle hover background */
}
::v-deep([data-pc-section="menu"] [data-pc-section="action"]:hover) {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  background-color: #f0f0f0; /* optional: subtle hover background */
}
::v-deep([data-pc-name="menuitem"] [data-pc-section="action"]:hover) {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  background-color: #f0f0f0; /* optional: subtle hover background */
}
/* 🔘 Remove bullet styles from each list item */
::v-deep([data-pc-section="menuitem"]) {
  list-style: none;
}

/* 🔘 Make menu links cleaner */
::v-deep([data-pc-section="action"]) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: #000;
  text-decoration: none;
}

/* ✴️ Hover effect */
::v-deep([data-pc-section="action"]:hover) {
  background-color: #f5f5f5;
  cursor: pointer;
}

/* 🎯 Optional: style the icon */
::v-deep([data-pc-section="icon"]) {
  color: #666;
}

/* 🎯 Optional: label styling */
::v-deep([data-pc-section="label"]) {
  font-weight: 500;
}

.content-body {
  padding: 2rem;
  overflow-y: auto;
}
/* Apply within <style scoped> in MainLayout.vue */

::v-deep([data-pc-section="headeraction"]) {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem 0.75rem 0;
  color: #333;
  font-size: 0.95rem;
  border-radius: 6px;
  transition: background-color 0.3s;
  text-decoration: none;
}

::v-deep([data-pc-section="headeraction"]:hover) {
  background-color: #fff;
  color: #1D4ED8;
  cursor: pointer;
}

::v-deep([data-pc-section="headericon"]) {
  margin-right: 0.5rem;
  font-size: 1.1rem;
  color: #000;
}
::v-deep([data-pc-section="headericon"]:hover) {
  background-color: #fff;
  color: #1D4ED8;
  cursor: pointer;
}

::v-deep([data-pc-section="headerlabel"]) {
  font-weight: 500;
}
/* Custom active menu styling */
::v-deep(.menu-active [data-pc-section="headeraction"]) {
  color: #1D4ED8;
  font-weight: bold;
}

::v-deep(.menu-active [data-pc-section="headericon"]) {
  color: #1D4ED8;
}
::v-deep(.custom-panelmenu-item svg) {
  fill: #1D4ED8;
}

::v-deep(.custom-panelmenu-item) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  color: #333;
}

::v-deep(.custom-icon-wrapper svg) {
  width: 1.2rem;
  height: 1.2rem;
  fill: #1D4ED8;
}

</style>
