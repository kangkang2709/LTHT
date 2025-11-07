<template>
  <div>
    <!-- Debug: bật nếu cần xem dữ liệu -->
    <!-- <pre class="mb-4 text-xs text-gray-500">{{ products }}</pre> -->

    <ul
      v-if="products.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <li
        v-for="p in products"
        :key="p.id"
        class="group relative bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition transform hover:-translate-y-1"
      >
        <!-- Nội dung -->
        <div class="flex flex-col">
          <strong class="text-gray-800 text-lg font-semibold truncate">
            {{ p.name || "(no name)" }}
          </strong>
          <span class="text-gray-500 mt-1 text-sm">
            ${{
              typeof p.price === "number" ? p.price.toFixed(2) : p.price || "-"
            }}
          </span>
        </div>

        <!-- Nút thao tác -->
        <div
          class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity"
        >
          <button
            @click="$emit('edit', p)"
            class="p-1.5 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 transition"
            title="Edit"
          >
            ✏️
          </button>
          <button
            @click="$emit('remove', p.id)"
            class="p-1.5 rounded-md bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </li>
    </ul>

    <!-- Khi chưa có sản phẩm -->
    <p v-else class="text-center text-gray-400 py-10 text-sm">
      No products yet. Add one above!
    </p>
  </div>
</template>

<script setup>
defineProps({
  products: {
    type: Array,
    required: true,
  },
});
</script>
