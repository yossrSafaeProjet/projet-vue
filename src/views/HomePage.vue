<template>
  <div>
    <h1>Dashboard</h1>

    <!-- Afficher pour Developer uniquement -->
    <div v-if="isDeveloper && !isManager">
      
      <ProjetDeveloperView />
    </div>

    <!-- Afficher pour Manager uniquement -->
    <div v-if="isManager && !isDeveloper">
      <h2>Gestion des projets pour Manager</h2>
      <h6>Gestion spécifique au rôle Manager</h6>
      <button @click="avancementProjet()"> </button>
      <ListeProjects :projects="projects" />

    </div>

    <!-- Afficher pour ceux qui ont les deux rôles -->
    <div v-if="isDeveloper && isManager">
      <h2>Dashboard complet (Developer + Manager)</h2>
      <p>Contenu accessible aux utilisateurs ayant les deux rôles.</p>
    </div>
  </div>
</template>

<script>
import ProjetDeveloperView from "./ProjetDeveloperView.vue";
import ListeProjects from "./ListeProjects.vue";

export default {
  components: {
    ProjetDeveloperView,
    ListeProjects,
  },
  data() {
    return {
      roles: [], // Liste des rôles récupérés
    };
  },
  computed: {
    isDeveloper() {
      return this.roles.includes("Developer");
    },
    isManager() {
      return this.roles.includes("Manager");
    },
  },
  created() {
    // Récupération des rôles depuis le localStorage
    try {
      const storedRoles = JSON.parse(localStorage.getItem("userRoles"));

      if (Array.isArray(storedRoles)) {
        this.roles = storedRoles;
      } else {
        console.error("Rôles non valides ou non trouvés dans le localStorage.");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des rôles :", error);
    }
  },
};
</script>
