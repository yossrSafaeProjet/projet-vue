<script setup>
import ProjetDeveloperView from './ProjetDeveloperView.vue'
import ModalVerifierManagerDeveloperView from './ModalVerifierManagerDeveloperView.vue'
 import {ref} from 'vue'
const projets = ref([{ id: 1, nom: "Projet1" }, { id: 2, nom: "Projet2" }]); 

</script>
<template>
  <h1>Liste des projets</h1>
  <div v-for="(projet,i) in projets" :key="projet.id" class="card mb-3" style="width: 18rem;">
    <div class="card-body">
      <h5 class="card-title">Projet {{ i + 1 }}</h5>
      <h6 class="card-subtitle mb-2 text-muted"> {{ projet.nom }}</h6>
      <div>
    <!-- Bouton pour ouvrir le modal -->
    <button
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#roleModal"
    >
      Vérifier votre rôle
    </button>
    <ModalVerifierManagerDeveloperView/>
  </div>
    </div>
  </div>
</template>
