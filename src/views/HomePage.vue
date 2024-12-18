<script setup>
import { ref, onMounted } from 'vue';
import ModalVerifierManagerDeveloperView from './ModalVerifierManagerDeveloperView.vue';

// Déclare la référence pour les projets
const projets = ref([]);

// Lors du montage du composant, on charge les projets depuis le localStorage
onMounted(() => {
  const storedProjects = localStorage.getItem('projects');
  if (storedProjects) {
    projets.value = JSON.parse(storedProjects);
  }
});
</script>

<template>
  <h1>Liste des projets</h1>
  <div v-for="(projet, i) in projets" :key="projet.id" class="card mb-3" style="width: 18rem;">
    <div class="card-body">
      <h5 class="card-title">Projet {{ i + 1 }}</h5>
      <h6 class="card-subtitle mb-2 text-muted">{{ projet.nom }}</h6>
      <div>
        <!-- Bouton pour ouvrir le modal -->
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#roleModal">
          Vérifier votre rôle
        </button>
        <ModalVerifierManagerDeveloperView />
      </div>
    </div>
  </div>
</template>
