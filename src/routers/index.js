import { createRouter, createWebHistory } from "vue-router";
import AuthPage from "../views/AuthPage.vue";
import RegisterPage from "../views/RegisterPage.vue";
import HomePage from "../views/HomePage.vue";
import ManageProjects from "../views/ManageProjects.vue";
import CreateTacheModalView from "../views/CreateTacheModalView.vue";
import ListeProjects from "../views/ListeProjects.vue";
import ProjetDeveloperView from "@/views/ProjetDeveloperView.vue";
import ListeAllTachesView from "@/views/ListeAllTachesView.vue";
import AjoutCommentaireModalView from "@/views/AjoutCommentaireModalView.vue";
import ProjectOverview from "@/views/ProjectOverview.vue";
import ListAllCommentaireView from "@/views/ListAllCommentaireView.vue";
import { useAuthStore } from "@/stores/auth.js";

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
    meta: { requiresAuth: true },
  },
  {
    path: "/ManageProjects",
    name: "ManageProjects",
    component: ManageProjects,
    meta: { requiresAuth: true },
  },
  {
    path: "/projetDeveloper/:developperId",
    name: "projetDeveloper",
    component: ProjetDeveloperView,
    meta: { requiresAuth: true },
  },
  {
    path: "/createTache",
    name: "createTache",
    component: CreateTacheModalView,
    meta: { requiresAuth: true },
  },
  {
    path: "/ListeProjects",
    name: "ListeProjects",
    component: ListeProjects,
    meta: { requiresAuth: true },
  },
  {
    path: "/allTaches/:projetId/:showAllTasks/:showAllTasksComplets",
    name: "allTaches",
    component: ListeAllTachesView,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/ajoutCommentaire",
    name: "ajoutCommentaire",
    component: AjoutCommentaireModalView,
    meta: { requiresAuth: true },
  },
  {
    path: "/project/:projectId",
    name: "Project",
    component: () => import("@/views/Project.vue"),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/ProjectOverview",
    name: "ProjectOverview",
    component: ProjectOverview,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/allCommentaire/:tacheId",
    name: "allCommentaire",
    component: ListAllCommentaireView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore(); 
  const requiresAuth = to.meta.requiresAuth;

  if (requiresAuth && !authStore.authenticatedUser) {
    next({ path: "/" }); 
  } else {
    next(); 
  }
});

export default router;
