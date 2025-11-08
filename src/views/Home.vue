<template>
  <div class="p-6 space-y-4">
    <h2 class="text-2xl font-bold">Danh sách người dùng</h2>

    <table class="min-w-full border border-gray-300 table-auto">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 border">#</th>
          <th class="px-4 py-2 border">Username</th>
          <th class="px-4 py-2 border">Ngày tạo</th>
          <th class="px-4 py-2 border">Số sản phẩm</th>
          <th class="px-4 py-2 border">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(user, index) in allRecords"
          :key="user.id"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-2 border text-center">
            {{ (page - 1) * pageSize + index + 1 }}
          </td>
          <td class="px-4 py-2 border">{{ user.username || "-" }}</td>
          <td class="px-4 py-2 border">
            {{ user.createAt ? new Date(user.createAt).toLocaleString() : "-" }}
          </td>
          <td class="px-4 py-2 border text-center">
            {{ user.products?.length || 0 }}
          </td>
          <td class="px-4 py-2 border text-center">
            <button
              @click="openModal(user)"
              class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
            >
              Xem chi tiết
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="flex items-center justify-between mt-4">
      <button
        @click="prevPage"
        :disabled="page <= 1 || loading"
        class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        ⬅️ Previous
      </button>

      <span class="font-medium">Page {{ page }}</span>

      <button
        @click="nextPage"
        :disabled="!hasMore || loading"
        class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        Next ➡️
      </button>
    </div>

    <!-- Modal -->
    <DetailModal
      :record="selectedRecord"
      :visible="modalVisible"
      @close="modalVisible = false"
    />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useFirebase } from "../composables/useFirebase";
import DetailModal from "../components/DetailModal.vue";

export default {
  components: { DetailModal },
  setup() {
    const {
      allRecords,
      page,
      pageSize,
      hasMore,
      loading,
      fetchPage,
      nextPage,
      prevPage,
      getRecordById,
      selectedRecord,
    } = useFirebase(10);

    const modalVisible = ref(false);

    onMounted(() => fetchPage(1));

    const openModal = (user) => {
      getRecordById(user.id);
      modalVisible.value = true;
    };

    return {
      allRecords,
      page,
      pageSize,
      hasMore,
      loading,
      nextPage,
      prevPage,
      selectedRecord,
      modalVisible,
      openModal,
    };
  },
};
</script>
