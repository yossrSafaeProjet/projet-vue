<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AjoutCommentaireModalView from './AjoutCommentaireModalView.vue';

const taches = ref([]);
const projetNom = ref(''); // Pour stocker le nom du projet

// Récupérer l'ID du projet depuis la route
const route = useRoute();
const projetId = route.params.projetId;

onMounted(() => {
  // Vérifier si des tâches sont stockées dans le localStorage
  const storedTaches = localStorage.getItem('taches');
  if (storedTaches) {
    const allTaches = JSON.parse(storedTaches);
    // Filtrer les tâches liées au projet actuel
    taches.value = allTaches.filter(tache => tache.projetId === projetId);

    // Récupérer le nom du projet pour l'afficher dans le titre
    const projet = allTaches.find(tache => tache.projetId === projetId);
    projetNom.value = projet ? projet.nom : 'Projet non trouvé';
  } else {
    alert('Pas de tâches pour ce projet!');
    window.location.href = '/projetDeveloper';
  }
});
</script>

<template>
  <h1>Liste des tâches associées au projet </h1>
  <div v-for="(tache, i) in taches" :key="tache.id" class="card mb-3" style="width: 18rem;">
    <div class="card-body">
      <h5 class="card-title">Tâche {{ i + 1 }}</h5>
      <h6 class="card-subtitle mb-2 text-muted">Nom de la tâche: {{ tache.titre }}</h6>
      <h6 class="card-subtitle mb-2 text-muted">Description : {{ tache.description }}</h6>
      <h6 class="card-subtitle mb-2 text-muted">Développeur Affecté : {{ tache.developper }}</h6>

      <!-- Premier bouton : Ajouter un commentaire -->
      <button class="btn btn-primary custom-btn" data-bs-toggle="modal" data-bs-target="#AjoutCommentaireModalView">
        Ajouter un commentaire
      </button>

      <!-- Modal pour ajouter un commentaire -->
      <AjoutCommentaireModalView />

      <!-- Deuxième bouton : Voir les commentaires -->
      <button class="btn btn-secondary custom-btn" data-bs-toggle="modal" data-bs-target="#voirCommentairesModal">
        Voir toutes les commentaires associés
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Style des boutons */
.custom-btn {
  width: 100%;
  margin-top: 10px; /* Ajoute de l'espace entre les boutons */
  font-size: 1rem; /* Taille de la police du bouton */
  padding: 10px 0; /* Padding pour augmenter la hauteur des boutons */
}

.custom-btn:first-child {
  background-color: #007bff; /* Couleur du bouton "Ajouter un commentaire" */
  border-color: #007bff;
}

.custom-btn:last-child {
  background-color: #6c757d; /* Couleur du bouton "Voir les commentaires" */
  border-color: #6c757d;
}

/* Ajout de la mise en forme lors du survol des boutons */
.custom-btn:hover {
  opacity: 0.9;
}

.custom-btn:focus {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5); /* Effet de focus sur les boutons */
}
</style>
