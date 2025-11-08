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

      <div class="mb-3 text-sm text-gray-600">
        <strong>Thời gian tạo:</strong> {{ formatDate(record.createAt) }}
      </div>

      <!-- Nội dung in -->
      <div ref="printArea" class="print-content space-y-6">
        <!-- Các bảng chi tiết -->
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
                  <th class="px-3 py-2 border bg-gray-100 font-bold">
                    Sản phấm / SL
                  </th>
                  <th
                    v-for="(p, pIndex) in colChunk"
                    :key="p.id || pIndex"
                    class="px-3 py-2 border bg-gray-100 font-bold"
                  >
                    -- {{ p.name }} --<br />

                    <span class="text-sm font-normal"
                      >Giá: {{ formatCurrency(p.price) }} /{{ p.unit }}
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

                <!-- Tổng cho nhóm -->
                <template v-if="rowIndex === quantityChunks.length - 1">
                  <tr class="font-bold bg-gray-50">
                    <td class="px-2 py-1 border text-center">Tổng</td>
                    <td
                      v-for="p in colChunk"
                      :key="p.id"
                      class="px-2 py-1 border text-center"
                    >
                      {{ p.totalQty }} - {{ p.unit }}
                    </td>
                  </tr>
                  <tr class="font-bold bg-gray-50">
                    <td class="px-2 py-1 border text-center">Tổng tiền</td>
                    <td
                      v-for="p in colChunk"
                      :key="p.id"
                      class="px-2 py-1 border text-center"
                    >
                      {{ formatCurrency(p.totalPrice) }}
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 📄 Trang thống kê (trang riêng cuối) -->
        <div class="overflow-auto border rounded print-summary-page mt-6">
          <h3 class="text-lg font-bold text-center my-3 underline">
            TỔNG KẾT TOÀN BỘ
          </h3>
          <table
            class="table-auto border-collapse border border-gray-300 w-full text-sm"
          >
            <thead>
              <tr class="bg-gray-100 font-bold">
                <th class="border px-3 py-2">#</th>
                <th class="border px-3 py-2">Tên sản phẩm</th>
                <th class="border px-3 py-2">Đơn vị</th>
                <th class="border px-3 py-2">Giá</th>
                <th class="border px-3 py-2">Tổng SL</th>
                <th class="border px-3 py-2">Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, idx) in record.products" :key="idx">
                <td class="border px-2 py-1 text-center">{{ idx + 1 }}</td>
                <td class="border px-2 py-1">{{ p.name }}</td>
                <td class="border px-2 py-1 text-center">{{ p.unit }}</td>
                <td class="border px-2 py-1 text-right">
                  {{ formatCurrency(p.price) }}
                </td>
                <td class="border px-2 py-1 text-right">{{ p.totalQty }}</td>
                <td class="border px-2 py-1 text-right font-semibold">
                  {{ formatCurrency(p.totalPrice) }}
                </td>
              </tr>

              <!-- Tổng cộng -->
              <tr class="bg-gray-200 font-bold">
                <td colspan="4" class="border px-2 py-1 text-right">
                  Tổng cộng:
                </td>
                <td class="border px-2 py-1 text-right">{{ totalAllQty }}</td>
                <td class="border px-2 py-1 text-right">
                  {{ formatCurrency(totalAllPrice) }}
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Chữ ký -->
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
      const colSize = 8; // mỗi trang 8 sản phẩm
      const products = this.record.products;
      for (let i = 0; i < products.length; i += colSize) {
        chunks.push(products.slice(i, i + colSize));
      }
      return chunks;
    },
    totalAllQty() {
      return this.record.products.reduce(
        (sum, p) => sum + (p.totalQty || 0),
        0
      );
    },
    totalAllPrice() {
      return this.record.products.reduce(
        (sum, p) => sum + (p.totalPrice || 0),
        0
      );
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
                .print-summary-page { page-break-before: always; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ccc; padding: 4px; text-align: center; }
                thead { background-color: #f0f0f0; display: table-header-group; }
                tr { page-break-inside: avoid; }
                .font-bold { font-weight: bold; }
              }
              body { font-family: Arial, sans-serif; font-size: 12px; }
              h2 { font-weight: bold; }
              h3 { font-weight: bold; text-decoration: underline; }
            </style>
          </head>
          <body>
            <h2>Chi tiết người dùng: ${this.record.username}</h2>
            <div><strong>Thời gian tạo:</strong> ${this.formatDate(
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
