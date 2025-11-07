<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col items-center py-12 px-4"
  >
    <!-- Header -->
    <header class="w-full max-w-4xl mb-10 text-center">
      <h1
        class="text-4xl font-semibold text-gray-800 tracking-tight flex items-center justify-center gap-2"
      >
        🛍️
        <span
          class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >Product Dashboard</span
        >
      </h1>
      <p class="text-gray-500 mt-2 text-sm">
        Manage products with style and simplicity
      </p>
    </header>

    <!-- Dashboard Wrapper -->
    <div
      class="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 space-y-8 transition-all duration-300"
    >
      <!-- Form -->
      <section>
        <ProductForm @add="addProduct" />
      </section>

      <!-- Product List -->
      <section v-if="products.length > 0">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-medium text-gray-700 flex items-center gap-2">
            📦 <span>Product List</span>
          </h2>
          <span class="text-sm text-gray-400">{{ products.length }} items</span>
        </div>
        <ProductList
          :products="products"
          @remove="removeProduct"
          @edit="startEdit"
        />
      </section>

      <!-- Empty State -->
      <section v-else class="text-center py-12 text-gray-400">
        <p class="text-base">No products yet. Add one above!</p>
      </section>

      <!-- Editor -->
      <transition name="fade">
        <ProductEditor
          v-if="editMode"
          :editItem="editItem"
          @save="saveEdit"
          @cancel="cancelEdit"
        />
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useProducts } from "../composables/useProducts";
import ProductForm from "../components/products/ProductForm.vue";
import ProductList from "../components/products/ProductList.vue";
import ProductEditor from "../components/products/ProductEditor.vue";

const { products, addProduct, removeProduct, updateProduct } = useProducts();

const editMode = ref(false);
const editItem = ref(null);

function startEdit(item) {
  editMode.value = true;
  editItem.value = { ...item };
}

async function saveEdit(updated) {
  await updateProduct(updated);
  editMode.value = false;
}

function cancelEdit() {
  editMode.value = false;
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
