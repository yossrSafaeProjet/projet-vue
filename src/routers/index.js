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
  {
    path: "/ManageProjects",
    name: "ManageProjects",
    component: ManageProjects,
  },
  {
    path: "/projetDeveloper/:developperId",
    name: "projetDeveloper",
    component: ProjetDeveloperView,
  },
  {
    path: "/createTache",
    name: "createTache",
    component: CreateTacheModalView,
  },
  {
    path: "/ListeProjects",
    name: "ListeProjects",
    component: ListeProjects,
  },
  {
    path: "/allTaches/:projetId",
    name: "allTaches",
    component: ListeAllTachesView,
  },
  {
    path: "/ajoutCommentaire",
    name: "ajoutCommentaire",
    component: AjoutCommentaireModalView,
  },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

