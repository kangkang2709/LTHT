// src/composables/useProducts.js
import { ref, onMounted } from "vue";
import { db } from "../config/firebase";
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
} from "firebase/firestore";

/**
 * Composable quản lý danh sách sản phẩm (non-realtime)
 * Dữ liệu chỉ được tải/làm mới khi gọi loadProducts() hoặc sau mỗi thao tác CRUD.
 */
export function useProducts() {
    const products = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    /** 🔄 Load danh sách sản phẩm từ Firestore */
    async function loadProducts() {
        isLoading.value = true;
        error.value = null;

        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            products.value = querySnapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            }));
        } catch (err) {
            console.error("❌ Load products failed:", err);
            error.value = "Failed to load products.";
        } finally {
            isLoading.value = false;
        }
    }

    /** ➕ Thêm sản phẩm mới */
    async function addProduct(product) {
        try {
            const clean = {
                name: product.name.trim(),
                price: Number(product.price),
                createdAt: new Date().toISOString(),
            };
            await addDoc(collection(db, "products"), clean);
            await loadProducts(); // reload danh sách
        } catch (err) {
            console.error("❌ Add product failed:", err);
            error.value = "Failed to add product.";
        }
    }

    /** 🗑️ Xóa sản phẩm */
    async function removeProduct(id) {
        try {
            await deleteDoc(doc(db, "products", id));
            products.value = products.value.filter((p) => p.id !== id); // cập nhật local nhanh
        } catch (err) {
            console.error("❌ Remove product failed:", err);
            error.value = "Failed to remove product.";
        }
    }

    /** ✏️ Cập nhật sản phẩm */
    async function updateProduct(product) {
        try {
            const refDoc = doc(db, "products", product.id);
            const updated = {
                name: product.name.trim(),
                price: Number(product.price),
                updatedAt: new Date().toISOString(),
            };
            await updateDoc(refDoc, updated);
            await loadProducts(); // reload danh sách sau update
        } catch (err) {
            console.error("❌ Update product failed:", err);
            error.value = "Failed to update product.";
        }
    }

    // 🚀 Tự động load dữ liệu khi composable được mount
    onMounted(loadProducts);

    return {
        products,
        isLoading,
        error,
        loadProducts,
        addProduct,
        removeProduct,
        updateProduct,
    };
}
