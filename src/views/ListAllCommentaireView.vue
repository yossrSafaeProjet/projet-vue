<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
const commentaires=ref([]);
const projets=ref([]);
const tacheName=ref('');
const route = useRoute();
const tacheId = route.params.tacheId;
onMounted(() => {
  projets.value = JSON.parse(localStorage.getItem('projects')) || [];
  const tache = projets.value
  .flatMap(projet => projet.tasks)
  .find(tache => tache.id === tacheId);
  tacheName.value=tache.titre;
  commentaires.value = JSON.parse(localStorage.getItem('commentaires')) || [];
  if (commentaires) {
     commentaires.value = commentaires.value.filter((c) => c.taskId === tacheId);

  } else {
    alert('Pas de commentaire pour cette tache !');
  }
});
function Retourner(){
  window.location.href="/dashboard"
 }
</script>

<template>
    <div class="page-title">
    <h1 v-if="commentaires && commentaires.length !== 0">Liste des commentaires associées à la tache " {{ tacheName }} "</h1>
    <h1 v-else>Vous n'avez pas de commentaires associées à cette tache "{{ tacheName }}"</h1>
</div>
<button @click="Retourner" >Retour</button>
    <div class="card-container">
    <div v-for="(commentaire, i) in commentaires" :key="commentaire.id" class="card mb-3" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">Commentaire {{ i + 1 }}</h5>
        <div class="field">
          <span class="field-label">Description du  commentaire : </span>
          <span class="field-value">{{ commentaire.description }}</span>
        </div>
    </div>
    </div>
    </div>

  </template>
  <style src="@/assets/sharedStyle.css"></style>

  