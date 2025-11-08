<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
  >
    <div
      class="bg-white rounded shadow-lg max-w-full w-[95%] max-h-[90%] overflow-auto p-4"
    >
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">
          Chi tiết người dùng: {{ record.username }}
        </h2>
        <button
          @click="close"
          class="text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          &times;
        </button>
      </div>

      <!-- Thời gian -->
      <div class="mb-3 text-sm text-gray-600">
        Thời gian tạo: {{ formatDate(record.createAt) }}
      </div>

      <!-- Nội dung in -->
      <div ref="printArea" class="print-content space-y-6">
        <div
          v-for="(colChunk, colIndex) in productChunks"
          :key="colIndex"
          class="space-y-4"
        >
          <div
            v-for="(rowChunk, rowIndex) in quantityChunks"
            :key="rowIndex"
            class="overflow-auto border rounded print-page"
          >
            <table
              class="table-auto border-collapse border border-gray-300 w-full"
            >
              <thead>
                <tr>
                  <th class="px-3 py-2 border sticky top-0 bg-white z-10">
                    Sản phẩm
                  </th>
                  <th
                    v-for="(p, pIndex) in colChunk"
                    :key="p.id || pIndex"
                    class="px-3 py-2 border sticky top-0 bg-white z-10"
                  >
                    --{{ p.name }}--<br />
                    <span class="text-sm"
                      >Giá: {{ formatCurrency(p.price) }} / {{ p.unit }}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="rowNum in rowChunk" :key="rowNum">
                  <td class="px-2 py-1 border text-center">{{ rowNum }}</td>
                  <td
                    v-for="p in colChunk"
                    :key="p.id"
                    class="px-2 py-1 border text-center"
                  >
                    {{ p.quantities[rowNum - 1] ?? "" }}
                  </td>
                </tr>

                <!-- Hiển thị tổng cho mỗi nhóm cột -->
                <template v-if="rowIndex === quantityChunks.length - 1">
                  <tr>
                    <td class="px-2 py-1 border font-semibold text-center">
                      Tổng
                    </td>
                    <td
                      v-for="p in colChunk"
                      :key="p.id"
                      class="px-2 py-1 border font-semibold text-center"
                    >
                      {{ p.totalQty }}
                    </td>
                  </tr>
                  <tr>
                    <td class="px-2 py-1 border font-semibold text-center">
                      Tổng tiền
                    </td>
                    <td
                      v-for="p in colChunk"
                      :key="p.id"
                      class="px-2 py-1 border font-semibold text-center"
                    >
                      {{ formatCurrency(p.totalPrice) }}
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-4 flex justify-end space-x-2">
        <button
          @click="print"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          In bảng
        </button>
        <button
          @click="close"
          class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Đóng
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    record: { type: Object, default: () => ({ products: [] }) },
    visible: { type: Boolean, default: false },
  },
  emits: ["close"],
  computed: {
    maxQuantity() {
      return Math.max(
        ...this.record.products.map((p) => p.quantities.length),
        0
      );
    },
    quantityChunks() {
      const chunks = [];
      const chunkSize = 50;
      for (let i = 0; i < this.maxQuantity; i += chunkSize) {
        const chunk = [];
        for (let j = 0; j < chunkSize && i + j < this.maxQuantity; j++) {
          chunk.push(i + j + 1);
        }
        chunks.push(chunk);
      }
      return chunks;
    },
    productChunks() {
      const chunks = [];
      const colSize = 8;
      const products = this.record.products;
      for (let i = 0; i < products.length; i += colSize) {
        chunks.push(products.slice(i, i + colSize));
      }
      return chunks;
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount || 0);
    },
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return (
        date.toLocaleTimeString("vi-VN") +
        " " +
        date.toLocaleDateString("vi-VN")
      );
    },
    print() {
      const printArea = this.$refs.printArea?.innerHTML || "";
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>In chi tiết</title>
            <style>
              @media print {
                @page { size: A4 landscape; margin: 10mm; }
                .print-page { page-break-after: always; }
                .print-page:last-child { page-break-after: auto; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ccc; padding: 4px; text-align: center; }
                thead { background-color: #f0f0f0; display: table-header-group; }
                tr { page-break-inside: avoid; }
              }
              body { font-family: Arial, sans-serif; font-size: 12px; }
              h2 { margin-bottom: 4px; }
              .info { margin-bottom: 8px; font-size: 13px; color: #333; }
            </style>
          </head>
          <body>
            <h2>Chi tiết người dùng: ${this.record.username}</h2>
            <div class="info">Thời gian tạo: ${this.formatDate(
              this.record.createAt
            )}</div>
            ${printArea}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    },
  },
};
</script>
