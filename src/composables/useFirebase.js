// composables/useFirebase.js
import { ref, computed } from "vue";
import { db } from "../config/firebase";
import {
    collection,
    getDocs,
    addDoc,
    query,
    orderBy,
    limit,
    startAfter,
} from "firebase/firestore";

export function useFirebase(defaultPageSize = 10) {
    // --- State ---
    const username = ref("");
    const products = ref([]);
    const allRecords = ref([]); // chỉ chứa page hiện tại
    const page = ref(1);
    const pageSize = ref(defaultPageSize);
    const totalPages = ref(0);
    const lastVisible = ref(null); // cursor Firestore
    const pageCursors = ref([]); // lưu cursor của từng page
    const hasMore = ref(true);
    const loading = ref(false);
    const selectedRecord = ref(null);

    // --- Fetch a specific page ---
    const fetchPage = async (pageNum = 1) => {
        loading.value = true;
        try {
            let q;
            const col = collection(db, "allUserData");

            if (pageNum === 1) {
                q = query(col, orderBy("createAt", "desc"), limit(pageSize.value));
            } else {
                const cursor = pageCursors.value[pageNum - 2]; // cursor của page trước
                if (!cursor) {
                    console.warn("No cursor for previous page, cannot fetch this page");
                    loading.value = false;
                    return;
                }
                q = query(col, orderBy("createAt", "desc"), startAfter(cursor), limit(pageSize.value));
            }

            const snapshot = await getDocs(q);

            // set page records
            allRecords.value = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
            lastVisible.value = snapshot.docs[snapshot.docs.length - 1] || null;

            // lưu cursor cho page hiện tại
            pageCursors.value[pageNum - 1] = lastVisible.value;

            page.value = pageNum;
            hasMore.value = snapshot.docs.length === pageSize.value;
            totalPages.value = pageNum + (hasMore.value ? 1 : 0);
        } catch (e) {
            console.error("Failed to fetch page:", e);
        } finally {
            loading.value = false;
        }
    };

    const nextPage = () => {
        if (!hasMore.value || loading.value) return;
        fetchPage(page.value + 1);
    };

    const prevPage = () => {
        if (page.value <= 1 || loading.value) return;
        fetchPage(page.value - 1);
    };

    // --- Combo box options ---
    const userOptions = computed(() =>
        allRecords.value.map((r) => ({
            id: r.id,
            label: `${r.username} – ${new Date(r.createAt).toLocaleString()}`,
        }))
    );

    // --- Get record by ID ---
    const getRecordById = (recordId) => {
        selectedRecord.value = allRecords.value.find((r) => r.id === recordId) || null;
    };

    // --- Save new record ---
    const saveRecord = async (usernameVal, productsVal) => {
        const productsFiltered = productsVal
            .map((p) => {
                const quantities = p.quantities.filter((q) => q > 0);
                const totalQty = quantities.reduce((a, b) => a + b, 0);
                const totalPrice = totalQty * (p.price || 0);
                return { ...p, quantities, totalQty, totalPrice };
            })
            .filter((p) => p.totalQty > 0);

        if (productsFiltered.length === 0) {
            alert("Không có sản phẩm hợp lệ để lưu!");
            return null;
        }

        const record = {
            username: usernameVal,
            createAt: new Date().toISOString(),
            products: productsFiltered,
        };

        try {
            const docRef = await addDoc(collection(db, "allUserData"), record);
            console.log("Saved record with ID:", docRef.id);
            alert("Đã lưu dữ liệu vào Firebase!");
            await fetchPage(1); // reload first page
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
        selectedRecord,
        lastVisible,
        pageCursors,
        hasMore,
        loading,
        userOptions,
        fetchPage,
        nextPage,
        prevPage,
        getRecordById,
        saveRecord,
    };
}
