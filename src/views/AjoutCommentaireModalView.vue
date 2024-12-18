<script setup>
  import {ref } from 'vue';

const taches=ref([{id:1,nom:"ee",description:"ddd",developper:"aa"}])
const commentaires=ref([])

// Charger les tâches depuis le localStorage au démarrage
if (localStorage.getItem('commentaires')) {
  commentaires.value = JSON.parse(localStorage.getItem('commentaires'));
}

function crerCommentaire(event) {
  event.preventDefault();
  // Créer une nouvelle commentaires
  const nouveauCommentaire = {
    id: crypto.randomUUID(),
    description: event.target.commentaire.value,
  };

  // Ajouter la nouvelle commentaire à la liste
  commentaires.value.push(nouveauCommentaire);
  // Sauvegarder la liste des tâches dans le localStorage
  localStorage.setItem('commentaires', JSON.stringify(commentaires.value));
  alert('Commentaire bien ajoutée');
 
  // Vider le formulaire
  event.target.reset();
  window.location.href = '/allTaches';}
  
</script>
<template>
  <!-- Modal pour ajouter un commentaire à une tâche -->
  <div v-for="task in taches" :key="task.id">
    <div class="modal fade" id="AjoutCommentaireModalView" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" :id="'modalLabel_' + task.id">Ajouter un commentaire pour {{ task.titre }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="crerCommentaire">
              <div class="mb-3">
                <label for="commentaire" class="form-label">Commentaire</label>
                <textarea class="form-control" name="commentaire" id="commentaire" v-model="commentaire" rows="3" required></textarea>
              </div>
              <button type="submit" class="btn btn-primary">Ajouter le commentaire</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Liste des commentaires pour chaque tâche -->
<!--   <div v-for="task in taches" :key="task.id" class="mt-3">
    <h5>Commentaires pour {{ task.nom }}</h5>
    <div v-if="task.commentaires && task.commentaires.length">
      <ul class="list-group">
        <li v-for="(commentaire, index) in task.commentaires" :key="index" class="list-group-item">
          {{ commentaire }}
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Aucun commentaire pour cette tâche.</p>
    </div>
  </div> -->
</template>