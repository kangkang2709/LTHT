<template>
  <div>
    <vue3-confirm-dialog></vue3-confirm-dialog>
    <table
      class="w-full border-collapse text-left rounded-lg overflow-hidden shadow"
    >
      <thead class="bg-indigo-50">
        <tr>
          <th class="p-3 border-b text-gray-600">#</th>
          <th class="p-3 border-b text-gray-600">Name</th>
          <th class="p-3 border-b text-gray-600">Price ($)</th>
          <th class="p-3 border-b text-gray-600">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(product, index) in products"
          :key="product.id"
          class="bg-white hover:bg-gray-50 transition"
        >
          <td class="p-3 border-b">{{ (page - 1) * pageSize + index + 1 }}</td>
          <td class="p-3 border-b">{{ product.name }}</td>
          <td class="p-3 border-b">{{ product.price.toFixed(2) }}</td>
          <td class="p-3 border-b flex gap-2">
            <!-- Edit Button -->
            <button
              @click="$emit('edit', product)"
              class="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              aria-label="Edit product"
            >
              ✏️
            </button>

            <!-- Delete Button with confirm -->
            <button
              @click="confirmDelete(product.id)"
              class="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              aria-label="Delete product"
            >
              🗑️
            </button>
          </td>
        </tr>

        <tr v-if="products.length === 0">
          <td colspan="4" class="p-4 text-center text-gray-400">
            No products on this page.
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <nav class="flex justify-between items-center mt-4" aria-label="Pagination">
      <button
        @click="prevPage"
        :disabled="page <= 1"
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
      >
        ⬅️ Previous
      </button>
      <span class="text-gray-600">Page {{ page }} of {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="page >= totalPages"
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
      >
        Next ➡️
      </button>
    </nav>
  </div>
</template>

<script>
export default {
  name: "ProductList",
  props: {
    products: {
      type: Array,
      required: true,
    },
    page: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 5,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    totalPages() {
      return Math.max(1, Math.ceil(this.total / this.pageSize));
    },
  },
  methods: {
    prevPage() {
      if (this.page > 1) this.$emit("changePage", this.page - 1);
    },
    nextPage() {
      if (this.page < this.totalPages) this.$emit("changePage", this.page + 1);
    },
    confirmDelete(id) {
      this.$confirm({
        message: "Are you sure?",
        button: {
          no: "No",
          yes: "Yes",
        },
        callback: (confirmed) => {
          if (confirmed) this.$emit("remove", id);
        },
      });
    },
  },
};
</script>
