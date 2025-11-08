<template>
  <main
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col items-center py-6 px-4 md:py-12"
  >
    <!-- Header -->
    <header class="w-full max-w-4xl mb-6 md:mb-10 text-center">
      <h1
        class="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight flex items-center justify-center gap-2"
      >
        🛍️
        <span
          class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >Product Dashboard</span
        >
      </h1>
    </header>

    <section
      class="w-full max-w-4xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 space-y-6 md:space-y-8 transition-all"
    >
      <!-- Product Form -->
      <ProductForm @add="addProduct" />

      <!-- Product List -->
      <section v-if="allProducts.length > 0" class="overflow-x-auto">
        <ProductList
          :products="products"
          :page="page"
          :pageSize="pageSize"
          :total="total"
          @edit="startEdit"
          @remove="removeProduct"
          @changePage="goToPage"
        />
      </section>

      <!-- Empty State -->
      <section v-else class="text-center py-12 text-gray-400">
        <p class="text-lg">No products yet. Add one above!</p>
      </section>

      <!-- Editor Overlay -->
      <transition name="fade">
        <ProductEditor
          v-if="editMode"
          :editItem="editItem"
          @save="saveEdit"
          @cancel="cancelEdit"
        />
      </transition>
    </section>
  </main>
</template>

<script setup>
import { ref, computed } from "vue";
import { useProducts } from "../composables/useProducts";
import ProductForm from "../components/products/ProductForm.vue";
import ProductList from "../components/products/ProductList.vue";
import ProductEditor from "../components/products/ProductEditor.vue";

const { allProducts, addProduct, removeProduct, updateProduct } = useProducts();

// Pagination
const page = ref(1);
const pageSize = ref(5);
const total = computed(() => allProducts.value.length);

const products = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return allProducts.value.slice(start, end);
});

function goToPage(p) {
  if (p >= 1 && p <= Math.ceil(total.value / pageSize.value)) {
    page.value = p;
  }
}

// Edit state
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
