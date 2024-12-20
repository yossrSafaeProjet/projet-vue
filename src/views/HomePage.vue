<template>
  <div>
    <h1  class="page-title" >Dashboard</h1>

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
    <div v-if="isDeveloper && isManager" class="dashboard-container">
    <div class="card text-center shadow-sm">
      <div class="card-header bg-primary text-white">
        <h2>Dashboard complet</h2>
        <small>(Développeur + Manager)</small>
      </div>
      <div class="card-body">
        <p class="card-text">
          Contenu accessible aux utilisateurs ayant les deux rôles.
        </p>
        <div class="d-flex justify-content-center gap-3">
          <button class="btn btn-outline-primary" @click="GoToDeveloper">
            Développeur
          </button>
          <button class="btn btn-outline-secondary" @click="GoToManager">
            Manager
          </button>
        </div>
      </div>
    </div>
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
      roles: [],
      authenticatedUser: null,
      projetsAvecTaches:null,
      storedProjets:null,
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
  methods: {
    GoToDeveloper() {
      if (!Array.isArray(this.storedProjets)) {
      alert("Les projets ne sont pas valides ou manquants.");
      return;
    }
    console.log('projets',this.storedProjets);
    console.log('auth',this.authenticatedUser?.id);
    // Filtrer les projets qui ont des tâches affectées au développeur
    this.projetsAvecTaches = this.storedProjets.filter((projet) => {
      return projet.tasks && projet.tasks.some((tache) => tache.developerId === this.authenticatedUser?.id);
    });


    // Si aucun projet n'est trouvé, alerter
    if (this.projetsAvecTaches.length === 0) {
      alert("Oops, vous n'avez pas de tâches associées à un projet.");
    }else{
      const developerId = this.authenticatedUser?.id || "unknown";
    
      window.location.href = `/projetDeveloper/${developerId}`;
    }

    },
    GoToManager() {
      window.location.href = `/projetManager`;
    },
    avancementProjet() {
      alert("Afficher l'avancement des projets pour Manager");
    },
  },
  mounted() {
    try {
      this.authenticatedUser =
        JSON.parse(localStorage.getItem("authenticatedUser")) || {};
       this. storedProjets = JSON.parse(localStorage.getItem("projects")) || [];
    
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'utilisateur authentifié :",
        error
      );
    }
  },
};
</script>

<style src="@/assets/sharedStyle.css"></style>