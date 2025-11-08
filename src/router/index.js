// router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import ProductDashboard from "../views/ProductDashboard.vue";
import SettingDashboard from "../views/SettingDashboard.vue";

const routes = [
    { path: "/", component: Home },
    // { path: "/products", component: ProductDashboard },
    { path: "/settings", component: SettingDashboard },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
