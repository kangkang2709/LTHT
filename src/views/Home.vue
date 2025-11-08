<template>
  <div class="p-6 space-y-6">
    <!-- Confirm Dialog -->
    <vue3-confirm-dialog></vue3-confirm-dialog>

    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-800">📋 Danh sách người dùng</h2>
      <span v-if="loading" class="text-sm text-gray-500 animate-pulse"
        >Đang tải...</span
      >
    </div>

    <!-- Table -->
    <div
      class="overflow-x-auto shadow rounded-lg border border-gray-200 bg-white"
    >
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              #
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Tên người dùng
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Ngày tạo
            </th>
            <th
              class="px-4 py-3 text-center text-sm font-semibold text-gray-700"
            >
              Số sản phẩm
            </th>
            <th
              class="px-4 py-3 text-center text-sm font-semibold text-gray-700"
            >
              Hành động
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-100 text-sm">
          <tr
            v-for="(user, index) in allRecords"
            :key="user.id"
            class="hover:bg-blue-50 transition-colors duration-150"
          >
            <td class="px-4 py-3 text-center text-gray-600">
              {{ (page - 1) * pageSize + index + 1 }}
            </td>
            <td class="px-4 py-3 text-gray-800 font-medium">
              {{ user.username || "—" }}
            </td>
            <td class="px-4 py-3 text-gray-600">
              {{
                user.createAt ? new Date(user.createAt).toLocaleString() : "—"
              }}
            </td>
            <td class="px-4 py-3 text-center text-gray-700 font-semibold">
              {{ user.products?.length || 0 }}
            </td>
            <td class="px-4 py-3 text-center space-x-2">
              <button
                @click="openModal(user)"
                class="inline-flex items-center px-3 py-1.5 rounded-md bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition"
              >
                Xem
              </button>
              <button
                @click="confirmDelete(user)"
                class="inline-flex items-center px-3 py-1.5 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
              >
                Xoá
              </button>
            </td>
          </tr>

          <tr v-if="allRecords.length === 0 && !loading">
            <td colspan="5" class="text-center py-6 text-gray-400">
              Không có dữ liệu nào để hiển thị.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between mt-6">
      <button
        @click="prevPage"
        :disabled="page <= 1 || loading"
        class="px-4 py-2 rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ⬅️ Trang Trước
      </button>

      <span class="text-gray-700 font-semibold">Trang {{ page }}</span>

      <button
        @click="nextPage"
        :disabled="!hasMore || loading"
        class="px-4 py-2 rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Trang Sau ➡️
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
import { ref, onMounted, getCurrentInstance } from "vue";
import { useFirebase } from "../composables/useFirebase";
import DetailModal from "../components/DetailModal.vue";
import { useToast } from "vue-toast-notification";

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
      deleteRecordById,
      selectedRecord,
    } = useFirebase(10);

    const modalVisible = ref(false);
    const toast = useToast();
    const { proxy } = getCurrentInstance(); // để dùng this.$confirm

    onMounted(() => fetchPage(1));

    const openModal = (user) => {
      getRecordById(user.id);
      modalVisible.value = true;
    };

    const confirmDelete = async (user) => {
      proxy.$confirm({
        message: "Bạn có chắc chắn XÓA dữ liệu này?",
        button: { yes: "Đúng", no: "Không" },
        callback: async (confirmed) => {
          if (confirmed) {
            try {
              await deleteRecordById(user.id);
              fetchPage(page.value);
              toast.success("Xoá dữ liệu thành công!");
            } catch (error) {
              console.error("Lỗi khi xoá sản phẩm con:", error);
              toast.error("Xoá dữ liệu thất bại!");
              return;
            }
          }
        },
      });
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
      confirmDelete,
    };
  },
};
</script>

<style scoped>
table {
  border-radius: 8px;
  overflow: hidden;
}
</style>
