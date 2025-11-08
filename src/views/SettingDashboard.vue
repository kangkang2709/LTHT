<template>
  <div class="p-4 space-y-4">
    <vue3-confirm-dialog></vue3-confirm-dialog>

    <!-- User Info -->
    <div class="space-y-2">
      <label class="block font-semibold">Tên người dùng:</label>
      <input
        v-model="username"
        placeholder="Nhập tên người dùng"
        class="border rounded px-3 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>

    <!-- Thêm sản phẩm -->
    <button
      @click="addProduct"
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
    >
      Thêm sản phẩm
    </button>

    <!-- Danh sách sản phẩm dạng card -->
    <div class="flex space-x-4 overflow-x-auto py-2">
      <div
        v-for="(product, pIndex) in products"
        :key="product.id"
        class="flex-shrink-0 w-56 border border-gray-300 rounded p-3 bg-gray-50"
      >
        <!-- Product Info -->
        <div class="space-y-4">
          <div class="relative w-full">
            <input
              v-model="product.name"
              :id="'product-name-' + product.id"
              type="text"
              placeholder=" "
              class="peer w-full border rounded px-2 pt-5 pb-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <label
              :for="'product-name-' + product.id"
              class="font-bold absolute left-2 top-1 text-black-400 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-black peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-blue-500 peer-focus:text-sm"
            >
              Tên sản phẩm
            </label>
          </div>

          <div class="relative w-full">
            <input
              v-model="product.unit"
              :id="'product-unit-' + product.id"
              type="text"
              placeholder=" "
              class="peer w-full border rounded px-2 pt-5 pb-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <label
              :for="'product-unit-' + product.id"
              class="font-bold absolute left-2 top-1 text-black-400 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-black peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-blue-500 peer-focus:text-sm"
            >
              Đơn vị
            </label>
          </div>

          <div class="relative w-full">
            <input
              v-model.number="product.price"
              :id="'product-price-' + product.id"
              type="number"
              placeholder=" "
              class="peer w-full border rounded px-2 pt-5 pb-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <label
              :for="'product-price-' + product.id"
              class="font-bold absolute left-2 top-1 text-black-400 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-black peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-blue-500 peer-focus:text-sm"
            >
              Giá
            </label>
          </div>

          <!-- Xóa product với confirm -->
          <button
            @click="confirmRemoveProduct(pIndex)"
            class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 w-full"
          >
            Xóa sản phẩm
          </button>
        </div>

        <hr class="my-2" />

        <!-- Quantity -->
        <div class="space-y-1">
          <template v-for="(qty, qIndex) in product.quantities" :key="qIndex">
            <div class="flex items-center space-x-1">
              <div class="w-4 text-gray-700 text-sm text-center mr-4">
                {{ qIndex + 1 }}
              </div>

              <input
                type="number"
                v-model.number="product.quantities[qIndex]"
                placeholder="0"
                class="border rounded px-2 py-1 w-24 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <button
                @click="confirmRemoveQuantity(product, qIndex)"
                class="bg-red-400 text-white px-1 rounded hover:bg-red-500 text-xs"
              >
                -
              </button>
            </div>
          </template>

          <button
            @click="addQuantity(product)"
            class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 w-full text-sm mt-1"
          >
            Thêm
          </button>
        </div>

        <hr class="my-2" />

        <!-- Tổng -->
        <div class="space-y-1 text-center">
          <div class="font-semibold">
            Số lượng: {{ totalQty(product) }} {{ product.unit || "" }}
          </div>
          <div class="font-semibold">Tổng tiền: {{ totalPrice(product) }}</div>
        </div>
      </div>
    </div>

    <!-- Lưu dữ liệu -->
    <button
      @click="saveAll"
      class="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 transition mt-4"
    >
      Lưu dữ liệu
    </button>
  </div>
</template>

<script>
import { useFirebase } from "../composables/useFirebase";
import { useToast } from "vue-toast-notification";
const toast = useToast();

export default {
  data() {
    return {
      username: "",
      products: [],
    };
  },
  created() {
    // Load dữ liệu từ composable Firebase
    const fb = useFirebase();
    this.username = fb.username.value;
    this.products = fb.products.value;
    this.saveUsername = fb.saveUsername;
    this.saveProduct = fb.saveProduct;
    this.removeProductFirestore = fb.removeProduct;
  },
  methods: {
    addProduct() {
      const newId = Date.now().toString();
      this.products.push({
        id: newId,
        name: "",
        unit: "",
        price: 0,
        quantities: [],
      });
    },
    addQuantity(product) {
      product.quantities.push(0);
    },
    confirmRemoveQuantity(product, qIndex) {
      this.$confirm({
        message: "Bạn có chắc chắn muốn xóa số lượng này?",
        button: { yes: "Yes", no: "No" },
        callback: (confirmed) => {
          if (confirmed) this.removeQuantity(product, qIndex);
        },
      });
    },
    removeQuantity(product, index) {
      product.quantities.splice(index, 1);
    },
    confirmRemoveProduct(pIndex) {
      this.$confirm({
        message: "Bạn có chắc chắn muốn xóa sản phẩm này?",
        button: { yes: "Yes", no: "No" },
        callback: (confirmed) => {
          if (confirmed) this.removeProduct(pIndex);
        },
      });
    },
    async removeProduct(pIndex) {
      const removed = this.products.splice(pIndex, 1)[0];
      await this.removeProductFirestore(pIndex);
    },
    totalQty(product) {
      return product.quantities.reduce((a, b) => a + (b || 0), 0);
    },
    totalPrice(product) {
      const amount = this.totalQty(product) * (product.price || 0);
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);
    },
    async saveAll() {
      // Kiểm tra dữ liệu trống
      for (const [i, product] of this.products.entries()) {
        if (!product.name || !product.unit) {
          toast.warning(
            `Sản phẩm thứ ${i + 1} còn trường tên hoặc đơn vị trống!`
          );
          return;
        }
        if (
          product.price === null ||
          product.price === undefined ||
          product.price < 0
        ) {
          toast.warning(`Sản phẩm thứ ${i + 1} có giá không hợp lệ!`);
          return;
        }
        for (const [j, qty] of product.quantities.entries()) {
          if (qty === null || qty === undefined || qty < 0) {
            toast.warning(
              `Sản phẩm thứ ${i + 1}, quantity thứ ${j + 1} không hợp lệ!`
            );
            return;
          }
        }
      }

      // Hiển thị confirm
      this.$confirm({
        message: "Bạn có chắc chắn muốn lưu dữ liệu?",
        button: { yes: "Yes", no: "No" },
        callback: async (confirmed) => {
          if (!confirmed) {
            toast.info("Đã hủy lưu dữ liệu");
            return;
          }

          // Log dữ liệu ra console trước khi lưu
          console.log(
            "Dữ liệu sắp lưu:",
            JSON.stringify(this.products, null, 2)
          );

          try {
            const fb = useFirebase();
            const recordId = await fb.saveRecord(this.username, this.products);
            if (recordId) {
              toast.success("Đã lưu dữ liệu vào Firebase!");
            }
          } catch (e) {
            console.error("Lưu dữ liệu thất bại:", e);
            toast.error("Lưu dữ liệu thất bại!");
          }
        },
      });
    },
  },
};
</script>
