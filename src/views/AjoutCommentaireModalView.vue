<script setup>
import { ref } from 'vue';

const props = defineProps({
  tache: Object, 
});

const emit = defineEmits(['commentaire-created']);
const commentaireText = ref('');

function creerCommentaire() {
  // Vérifier que le champ n'est pas vide
  if (commentaireText.value.trim()) {
    const nouveauCommentaire = {
      id: crypto.randomUUID(),
      taskId: props.tache?.id, 
      description: commentaireText.value.trim(),
    };

    // Émettre l'événement avec le nouveau commentaire
    emit('commentaire-created', nouveauCommentaire);

    // Réinitialiser le champ de commentaire
    commentaireText.value = '';
  } else {
    alert('Veuillez saisir un commentaire valide.');
  }
}
</script>

<template>
  <!-- Modal pour ajouter un commentaire à une tâche -->
  <div>
    <div class="modal fade" id="AjoutCommentaireModalView" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Ajouter un commentaire pour {{ props.tache?.titre || 'une tâche inconnue' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="creerCommentaire">
              <div class="mb-3">
                <label for="commentaire" class="form-label">Commentaire</label>
                <textarea
                  class="form-control"
                  name="commentaire"
                  id="commentaire"
                  v-model="commentaireText"
                  rows="3"
                  required
                ></textarea>
              </div>
              <button type="submit" class="btn btn-primary">Ajouter le commentaire</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
