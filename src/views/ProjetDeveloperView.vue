<script setup>
import { ref } from 'vue';
import CreateTacheModalView from './CreateTacheModalView.vue';
const projets = ref([{ id: 1, nom: "Projet1" }, { id: 2, nom: "Projet2" }]);
</script>

<template>
  <h1>Liste des projets dont il a une tâche affectée</h1>
  <div v-for="(projet,i) in projets" :key="projet.id" class="card mb-3" style="width: 18rem;">
    <div class="card-body">
      <h5 class="card-title">Projet {{ i + 1 }}</h5>
      <h6 class="card-subtitle mb-2 text-muted"> {{ projet.nom }}</h6>
       <!-- Bouton pour ouvrir la popup -->
    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createTacheModal">
      Créer une tâche
    </button>
      <CreateTacheModalView/>
      <RouterLink to="/voirAllTache" class="card-link">Voir les taches </RouterLink>
    </div>
  </div>
</template>

<style>
.card {
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
