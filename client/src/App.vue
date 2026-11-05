<template>
  <div class="app-shell" :class="{ 'is-collapsed': collapsed }">
    <AppSidebar
      :groups="navGroups"
      :collapsed="collapsed"
      :mobile-open="mobileOpen"
      @toggle-collapse="toggleCollapse"
      @navigate="mobileOpen = false"
      @close="mobileOpen = false"
    />

    <div v-if="mobileOpen" class="app-scrim" @click="mobileOpen = false"></div>

    <div class="app-main">
      <AppTopbar @open-menu="mobileOpen = true">
        <LanguageSwitcher />
        <ProfileMenu
          @show-profile-details="showProfileDetails = true"
          @show-tasks="showTasks = true"
        />
      </AppTopbar>
      <FilterBar />
      <main class="app-page">
        <router-view />
      </main>
    </div>
  </div>

  <ProfileDetailsModal
    :is-open="showProfileDetails"
    @close="showProfileDetails = false"
  />

  <TasksModal
    :is-open="showTasks"
    :tasks="tasks"
    @close="showTasks = false"
    @add-task="addTask"
    @delete-task="deleteTask"
    @toggle-task="toggleTask"
  />
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api } from './api'
import { useAuth } from './composables/useAuth'
import { useI18n } from './composables/useI18n'
import FilterBar from './components/FilterBar.vue'
import ProfileMenu from './components/ProfileMenu.vue'
import ProfileDetailsModal from './components/ProfileDetailsModal.vue'
import TasksModal from './components/TasksModal.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import AppSidebar from './components/AppSidebar.vue'
import AppTopbar from './components/AppTopbar.vue'
import { useTheme } from './composables/useTheme'
import { NAV_GROUPS } from './navigation'

const COLLAPSE_KEY = 'sidebar-collapsed'
// Read at ref creation so a collapsed sidebar does not flash open on reload.
const readCollapsed = () => {
  try { return localStorage.getItem(COLLAPSE_KEY) === '1' } catch { return false }
}

export default {
  name: 'App',
  components: {
    FilterBar,
    ProfileMenu,
    ProfileDetailsModal,
    TasksModal,
    LanguageSwitcher,
    AppSidebar,
    AppTopbar
  },
  setup() {
    const { currentUser } = useAuth()
    const { t } = useI18n()
    useTheme() // ensures the theme module initializes and applies data-theme
    const route = useRoute()
    const navGroups = NAV_GROUPS
    const collapsed = ref(readCollapsed())
    const mobileOpen = ref(false)

    const toggleCollapse = () => {
      collapsed.value = !collapsed.value
      try { localStorage.setItem(COLLAPSE_KEY, collapsed.value ? '1' : '0') } catch { /* storage unavailable */ }
    }

    // Drawer closes on navigation and Escape, and body scroll is locked while open.
    watch(() => route.fullPath, () => { mobileOpen.value = false })
    watch(mobileOpen, (open) => { document.body.style.overflow = open ? 'hidden' : '' })
    const onKey = (e) => { if (e.key === 'Escape') mobileOpen.value = false }
    onMounted(() => window.addEventListener('keydown', onKey))
    onBeforeUnmount(() => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    })
    const showProfileDetails = ref(false)
    const showTasks = ref(false)
    const apiTasks = ref([])

    // Merge mock tasks from currentUser with API tasks
    const tasks = computed(() => {
      return [...currentUser.value.tasks, ...apiTasks.value]
    })

    const loadTasks = async () => {
      try {
        apiTasks.value = await api.getTasks()
      } catch (err) {
        console.error('Failed to load tasks:', err)
      }
    }

    const addTask = async (taskData) => {
      try {
        const newTask = await api.createTask(taskData)
        // Add new task to the beginning of the array
        apiTasks.value.unshift(newTask)
      } catch (err) {
        console.error('Failed to add task:', err)
      }
    }

    const deleteTask = async (taskId) => {
      try {
        // Check if it's a mock task (from currentUser)
        const isMockTask = currentUser.value.tasks.some(t => t.id === taskId)

        if (isMockTask) {
          // Remove from mock tasks
          const index = currentUser.value.tasks.findIndex(t => t.id === taskId)
          if (index !== -1) {
            currentUser.value.tasks.splice(index, 1)
          }
        } else {
          // Remove from API tasks
          await api.deleteTask(taskId)
          apiTasks.value = apiTasks.value.filter(t => t.id !== taskId)
        }
      } catch (err) {
        console.error('Failed to delete task:', err)
      }
    }

    const toggleTask = async (taskId) => {
      try {
        // Check if it's a mock task (from currentUser)
        const mockTask = currentUser.value.tasks.find(t => t.id === taskId)

        if (mockTask) {
          // Toggle mock task status
          mockTask.status = mockTask.status === 'pending' ? 'completed' : 'pending'
        } else {
          // Toggle API task
          const updatedTask = await api.toggleTask(taskId)
          const index = apiTasks.value.findIndex(t => t.id === taskId)
          if (index !== -1) {
            apiTasks.value[index] = updatedTask
          }
        }
      } catch (err) {
        console.error('Failed to toggle task:', err)
      }
    }

    onMounted(loadTasks)

    return {
      t,
      navGroups,
      collapsed,
      mobileOpen,
      toggleCollapse,
      showProfileDetails,
      showTasks,
      tasks,
      addTask,
      deleteTask,
      toggleTask
    }
  }
}
</script>

<style>
.app-shell {
  display: grid;
  grid-template-columns: var(--sidebar-w) minmax(0, 1fr);
  min-height: 100vh;
  transition: grid-template-columns var(--duration) var(--ease);
}
.app-shell.is-collapsed {
  grid-template-columns: var(--sidebar-w-collapsed) minmax(0, 1fr);
}
.app-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.app-page {
  flex: 1;
  width: 100%;
  min-width: 0;
  max-width: var(--content-max);
  margin: 0 auto;
  padding: var(--space-8);
}
.app-scrim { display: none; }

@media (max-width: 1023px) {
  .app-shell,
  .app-shell.is-collapsed { grid-template-columns: minmax(0, 1fr); }
  .app-scrim {
    display: block;
    position: fixed;
    inset: 0;
    background: var(--color-scrim);
    z-index: var(--z-scrim);
  }
}
@media (max-width: 767px) {
  .app-page { padding: var(--space-4); }
}
</style>
