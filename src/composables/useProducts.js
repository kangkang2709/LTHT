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
import { useToast } from 'vue-toast-notification';
const toast = useToast();
/**
 * Composable quản lý danh sách sản phẩm (non-realtime)
 */
export function useProducts() {
    const allProducts = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    async function loadProducts() {
        isLoading.value = true;
        error.value = null;

        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            allProducts.value = querySnapshot.docs.map((d) => ({
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

    async function addProduct(product) {
        try {
            const nameTrimmed = product.name.trim();

            // Check trùng tên
            const existing = allProducts.value.find(
                (p) => p.name.toLowerCase() === nameTrimmed.toLowerCase()
            );
            if (existing) {
                error.value = `Product "${nameTrimmed}" already exists.`;
                toast.warning("Sản phẩm đã tồn tại! Trùng tên sản phẩm.");
                return;
            }

            const clean = {
                name: nameTrimmed,
                price: Number(product.price),
                createdAt: new Date().toISOString(),
            };
            await addDoc(collection(db, "products"), clean);
            toast.success("Tạo sản phẩm" + nameTrimmed + "thành công!");
            await loadProducts();
        } catch (err) {
            console.error("❌ Add product failed:", err);
            error.value = "Failed to add product.";
            toast.error("Lỗi khi tạo sản phẩm!");
        }
    }


    async function removeProduct(id) {
        try {
            await deleteDoc(doc(db, "products", id));
            allProducts.value = allProducts.value.filter((p) => p.id !== id);
            toast.success("Xóa sản phẩm thành công!");
        } catch (err) {
            console.error("❌ Remove product failed:", err);
            error.value = "Failed to remove product.";
            toast.error("Lỗi khi xóa sản phẩm!");
        }
    }

    async function updateProduct(product) {
        try {
            const refDoc = doc(db, "products", product.id);
            const updated = {
                name: product.name.trim(),
                price: Number(product.price),
                updatedAt: new Date().toISOString(),
            };
            await updateDoc(refDoc, updated);
            toast.success("Cập nhật sản phẩm" + product.name + "thành công!");
            await loadProducts();
        } catch (err) {
            console.error("❌ Update product failed:", err);
            error.value = "Failed to update product.";
            toast.error("Lỗi khi cập nhật sản phẩm!");
        }
    }

    onMounted(loadProducts);

    return {
        allProducts,
        isLoading,
        error,
        loadProducts,
        addProduct,
        removeProduct,
        updateProduct,
    };
}
