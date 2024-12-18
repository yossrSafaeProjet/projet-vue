<script setup>
import { ref,onMounted } from 'vue';
import CreateTacheModalView from './CreateTacheModalView.vue';
import { useRoute } from 'vue-router';
/* const projets = ref([{ id: 1, nom: "Projet1" }, { id: 2, nom: "Projet2" }]); */
const projetsAvecTaches=ref([]);
const route = useRoute();
const developperId  = route.params.developperId;
const users=ref([]);
onMounted(() => {
     // Vérifier si des projets sont stockées dans le localStorage
     const storedProjets = localStorage.getItem('projects');
  // Vérifier si des tâches sont stockées dans le localStorage
  const storedTaches = localStorage.getItem('taches');
  if (storedTaches) {
    const allTaches = JSON.parse(storedTaches);
    // Filtrer les projets contenant des taches  liées au développeurs
    const projetsIds = allTaches
      .filter(tache => tache.developperId === developperId)
      .map(tache => tache.projetId);

    // Garder les projets uniques correspondant aux IDs
    if(storedProjets){
        projetsAvecTaches.value = storedProjets.value.filter(projet =>
      projetsIds.includes(projet.id)
    );
    }
   
  }
  if (localStorage.getItem('users')) {
  users.value = JSON.parse(localStorage.getItem('users'));
}

});
</script>

<template>
  <h1>Liste des projets associé</h1>
  <div v-for="(projet,i) in projets" :key="projet.id" class="card mb-3" style="width: 18rem;">
    <div class="card-body">
      <h5 class="card-title">Projet {{ i + 1 }}</h5>
      <h6 class="card-subtitle mb-2 text-muted"> {{ projet.nom }}</h6>
       <!-- Bouton pour ouvrir la popup -->
    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createTacheModal">
      Créer une tâche
    </button>
      <CreateTacheModalView/>
      <RouterLink :to="'/allTaches/' + projet.id" class="card-link">Voir les taches </RouterLink>
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
