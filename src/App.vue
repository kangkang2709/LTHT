<template>
  <div class="flex min-h-screen w-full bg-gray-100">
    <!-- Sidebar Navigation -->
    <aside
      class="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col"
    >
      <!-- Logo / Header -->
      <div
        class="h-20 flex items-center justify-center border-b border-gray-200"
      >
        <h1 class="text-2xl font-bold text-indigo-600">Dashboard</h1>
      </div>

      <!-- Navigation Items -->
      <nav class="flex-1 py-6">
        <ul>
          <li>
            <router-link
              to="/"
              class="flex items-center px-6 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
              active-class="bg-indigo-100 text-indigo-900 font-semibold"
            >
              <HomeIcon class="h-5 w-5 mr-3" />
              Home
            </router-link>
          </li>

          <li class="mt-2">
            <router-link
              to="/settings"
              class="flex items-center px-6 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
              active-class="bg-indigo-100 text-indigo-900 font-semibold"
            >
              <CogIcon class="h-5 w-5 mr-3" />
              Settings
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Container -->
    <div class="flex-1 flex flex-col min-h-screen">
      <!-- Header (full width of main area) -->
      <header class="bg-white shadow-sm py-4 px-8 border-b border-gray-200">
        <h1 class="text-2xl font-semibold text-gray-800">
          Welcome to Dashboard
        </h1>
      </header>

      <!-- Content Area (chiếm toàn bộ phần còn lại bên phải sidebar) -->
      <main class="flex-1 bg-gray-100 p-8 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { HomeIcon, ShoppingBagIcon, CogIcon } from "@heroicons/vue/solid";

export default {
  name: "App",
  components: {
    HomeIcon,
    ShoppingBagIcon,
    CogIcon,
  },
};
</script>

<style scoped>
.router-link-active {
  font-weight: 600;
}
</style>
