<script setup>
import { ref, onMounted } from "vue";
import CreateTacheModalView from "./CreateTacheModalView.vue";
import { useRoute } from "vue-router";

// Références réactives
const projetsAvecTaches = ref([]);
const selectedProject = ref(null);

// ID du développeur connecté
onMounted(() => {
  try {
    // Récupérer les projets depuis le localStorage
    const storedProjets = JSON.parse(localStorage.getItem("projects")) || [];
    const authenticatedUser = JSON.parse(localStorage.getItem("authenticatedUser")) || [];

    // Vérifier si les données sont présentes
    if (!Array.isArray(storedProjets)) {
      alert("Les projets ne sont pas valides ou manquants.");
      return;
    }

    // Filtrer les projets qui ont des tâches affectées au développeur
    projetsAvecTaches.value = storedProjets.filter((projet) => {
      return projet.tasks && projet.tasks.some((tache) => tache.developerId === authenticatedUser.id);
    });

    console.log("projet", JSON.stringify(projetsAvecTaches.value));

    // Si aucun projet n'est trouvé, alerter
    if (projetsAvecTaches.value.length === 0) {
      alert("Oops, vous n'avez pas de tâches associées à un projet.");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    alert("Une erreur est survenue.");
  }
});

// Fonction pour ajouter une tâche au projet sélectionné
function addTaskToProject(task) {
  console.log("ooo", task);
  
  // Trouver le projet auquel la tâche doit être ajoutée
  const project = projetsAvecTaches.value.find((p) => p.id === selectedProject.value?.id);
  if (project) {
    // Ajouter la tâche au tableau `tasks` du projet
    project.tasks.push(task);

    // Sauvegarder les projets avec la nouvelle tâche dans le localStorage
    localStorage.setItem("projects", JSON.stringify(projetsAvecTaches.value));
    alert("Tâche ajoutée avec succès !");
  } else {
    console.log("Projet non trouvé pour ajouter la tâche.");
  }
}
</script>

<template>
  <!-- Affichage des projets ou message si aucun projet n'a de tâches associées -->
  <h1 v-if="projetsAvecTaches && projetsAvecTaches.length !== 0">Liste des projets associés</h1>
  <h1 v-else>Vous n'avez pas de tâches associées à un projet.</h1>

  <!-- Liste des projets avec des tâches associées -->
  <div
    v-for="(projet, i) in projetsAvecTaches"
    :key="projet.id"
    class="card mb-3"
    style="width: 18rem;"
  >
    <div class="card-body">
      <h5 class="card-title">Projet {{ i + 1 }}</h5>
      <h6 class="card-subtitle mb-2 text-muted">{{ projet.name }}</h6>

      <!-- Bouton pour ouvrir la popup de création de tâche -->
      <button
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#createTacheModal"
        @click="selectedProject = projet" 
      >
        Créer une tâche
      </button>
      <CreateTacheModalView @task-created="addTaskToProject" />

      <!-- Lien vers les tâches du projet -->
      <RouterLink :to="'/allTaches/' + projet.id" class="card-link">
        Voir les tâches
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
