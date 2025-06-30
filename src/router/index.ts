import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import MainLayout from '../layouts/MainLayout.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/LoginPage.vue'),
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { title: 'Dashboard' }
      },
      {
        path: 'clinic-schedule',
        name: 'clinic-schedule',
        component: () => import('@/views/ClinicScheduleView.vue')
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('@/views/DashboardView.vue')
      },
      {
        path: 'help',
        name: 'help',
        component: () => import('@/views/DashboardView.vue')
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/views/DashboardView.vue')
      },
      {
        path: '/staff-profile',
        name: 'Staff Profile',
        component: () => import('@/views/StaffProfilePage.vue'),
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  await authStore.checkAuth()

  const isLoggedIn = !!authStore.user
  const isPublic = ['login'].includes(to.name as string)

  if (!isPublic && !isLoggedIn) {
    return next('/login')
  }

  if (to.name === 'login' && isLoggedIn) {
    return next('/dashboard')
  }

  return next()
})

export default router
