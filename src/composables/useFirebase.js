// composables/useFirebase.js
import { ref, computed } from "vue";
import { db } from "../config/firebase";
import { collection, getDocs, addDoc, doc, setDoc, deleteDoc } from "firebase/firestore";

export function useFirebase() {

    const username = ref("");
    const products = ref([]);
    const allRecords = ref([]);
    const page = ref(1);
    const pageSize = ref(10);
    const selectedRecord = ref(null);

    // --- Fetch all records ---
    const fetchAllRecords = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "allUserData"));
            allRecords.value = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            allRecords.value.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
        } catch (e) {
            console.error("Failed to fetch records:", e);
        }
    };

    // --- Combo box options ---
    const userOptions = computed(() =>
        allRecords.value.map(r => ({
            id: r.id,
            label: `${r.username} – ${new Date(r.createAt).toLocaleString()}`,
        }))
    );

    // --- Paging ---
    const totalPages = computed(() => Math.ceil(allRecords.value.length / pageSize.value));
    const pagedRecords = computed(() => {
        const start = (page.value - 1) * pageSize.value;
        return allRecords.value.slice(start, start + pageSize.value);
    });

    const nextPage = () => { if (page.value < totalPages.value) page.value++; };
    const prevPage = () => { if (page.value > 1) page.value--; };

    // --- Get full record by ID ---
    const getRecordById = (recordId) => {
        selectedRecord.value = allRecords.value.find(r => r.id === recordId) || null;
    };

    // --- Save new record ---
    const saveRecord = async (username, products) => {
        // Lọc quantity >0 và tính tổng
        const productsFiltered = products
            .map(p => {
                const quantities = p.quantities.filter(q => q > 0);
                const totalQty = quantities.reduce((a, b) => a + b, 0);
                const totalPrice = totalQty * (p.price || 0);
                return { ...p, quantities, totalQty, totalPrice };
            })
            .filter(p => p.totalQty > 0);

        if (productsFiltered.length === 0) {
            alert("Không có sản phẩm hợp lệ để lưu!");
            return null;
        }

        const record = {
            username,
            createAt: new Date().toISOString(),
            products: productsFiltered,
        };

        try {
            const docRef = await addDoc(collection(db, "allUserData"), record);
            console.log("Saved record with ID:", docRef.id);
            alert("Đã lưu dữ liệu vào Firebase!");
            await fetchAllRecords(); // cập nhật lại allRecords
            return docRef.id;
        } catch (e) {
            console.error("Error saving record:", e);
            alert("Lưu dữ liệu thất bại!");
            return null;
        }
    };

    return {
        username,
        products,
        allRecords,
        page,
        pageSize,
        totalPages,
        pagedRecords,
        selectedRecord,
        userOptions,
        fetchAllRecords,
        getRecordById,
        nextPage,
        prevPage,
        saveRecord,  // <-- đây là hàm lưu dữ liệu mới
    };
}