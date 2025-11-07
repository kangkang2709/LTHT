<template>
  <div
    class="flex flex-col sm:flex-row gap-3 items-center bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow border border-gray-200 transition-all"
  >
    <input
      v-model="name"
      type="text"
      placeholder="Product name"
      class="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none text-gray-700 placeholder-gray-400"
    />
    <input
      v-model.number="price"
      type="number"
      min="0"
      placeholder="Price"
      class="w-36 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none text-gray-700 placeholder-gray-400"
    />
    <button
      @click="handleAdd"
      class="px-6 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
    >
      ➕ Add
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["add"]);
const name = ref("");
const price = ref(null);

function handleAdd() {
  if (!name.value || price.value <= 0) {
    alert("Enter valid data!");
    return;
  }
  emit("add", { name: name.value.trim(), price: price.value });
  name.value = "";
  price.value = null;
}
</script>
