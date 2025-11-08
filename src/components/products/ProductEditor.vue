<template>
  <transition name="fade">
    <div
      v-if="editItem"
      class="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      style="margin: 10px"
    >
      <div
        class="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-6 w-full max-w-[22rem] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div class="flex items-center justify-between mb-4">
          <h3
            class="text-xl font-semibold text-gray-800 flex items-center gap-2"
          >
            ✏️ Edit Product
          </h3>
          <button
            @click="$emit('cancel')"
            class="text-gray-400 hover:text-gray-600 text-xl transition"
            title="Close"
          >
            ×
          </button>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-600 mb-1"
              >Product Name</label
            >
            <input
              v-model="localItem.name"
              type="text"
              placeholder="Enter product name"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none text-gray-700"
            />
          </div>

          <div class="w-full sm:w-40">
            <label class="block text-sm font-medium text-gray-600 mb-1"
              >Price ($)</label
            >
            <input
              v-model.number="localItem.price"
              type="number"
              min="0"
              placeholder="0.00"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none text-gray-700"
            />
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6" style="margin-top: 10px">
          <button
            @click="$emit('cancel')"
            class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all"
          >
            ❌ Cancel
          </button>

          <button
            @click="save"
            class="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            💾 Save
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  editItem: Object,
});
const emit = defineEmits(["save", "cancel"]);

const localItem = ref({});

watch(
  () => props.editItem,
  (newVal) => {
    localItem.value = newVal ? { ...newVal } : {};
  },
  { immediate: true }
);

function save() {
  if (!localItem.value.name || localItem.value.price <= 0) {
    alert("Please enter valid product information!");
    return;
  }
  emit("save", localItem.value);
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
