import { createRouter, createWebHistory } from "vue-router";
import AuthPage from "../views/AuthPage.vue";
import RegisterPage from "../views/RegisterPage.vue";
import HomePage from "../views/HomePage.vue";


const routes = [
  {
    path: "/",
    name: "Auth",
    component: AuthPage,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterPage,
  },
  {
    path: "/dashboard",
    name: "HomePage",
    component: HomePage,
  },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

