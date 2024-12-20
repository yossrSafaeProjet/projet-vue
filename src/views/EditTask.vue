<template>
  <div class="modal fade show" style="display: block;" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Éditer une tâche</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="editerTache">
            <div class="form-group row mb-3">
              <label for="titreTache" class="col-sm-4 col-form-label">Titre de la tâche</label>
              <div class="col-sm-8">
                <input type="text" class="form-control" id="titreTache" v-model="titreTache" required />
              </div>
            </div>
            <div class="form-group row mb-3">
              <label for="description" class="col-sm-4 col-form-label">Description</label>
              <div class="col-sm-8">
                <input type="text" class="form-control" id="description" v-model="description" required />
              </div>
            </div>
            <div v-if="isManager" class="form-group row mb-3">
              <label for="developer" class="col-sm-4 col-form-label">Assigner à un développeur</label>
              <div class="col-sm-8">
                <select class="form-control" v-model="developerId">
                  <option>Non affectée</option>
                  <option v-for="developer in developers" :key="developer.id" :value="developer.id">
                    {{ developer.firstName }} {{ developer.lastName }}
                  </option>
                </select>
              </div>
            </div>
            <!-- Champ de date limite -->
            <div class="form-group row mb-3">
              <label for="deadline" class="col-sm-4 col-form-label">Date limite</label>
              <div class="col-sm-8">
                <input type="date" class="form-control" id="deadline" v-model="deadline" required />
              </div>
            </div>

            <!-- Gestion du statut -->
            <fieldset class="form-group row mb-3">
              <legend class="col-form-label col-sm-4 pt-0">Statut</legend>
              <div class="col-sm-8">
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="a-faire" value="A faire" v-model="statut" />
                  <label class="form-check-label" for="a-faire">A faire</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="complete" value="Complétée" v-model="statut"  />
                  <label class="form-check-label" for="complete">Complétée</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="valid" value="Validée" v-model="statut" />
                  <label class="form-check-label" for="valid">Validée</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="non-valid" value="Non-validée" v-model="statut"  />
                  <label class="form-check-label" for="non-valid">Non validée</label>
                </div>
              </div>
            </fieldset>

            <!-- Bouton de soumission -->
            <div class="form-group row">
              <div class="col-sm-12 text-end">
                <button type="submit" class="btn btn-primary">Mettre à jour la tâche</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  task: {
    type: Object,
    required: true,
    default: () => ({
      titre: '',
      description: '',
      statut: '',
      developerId: null,
      deadline: '', // Ajouter la deadline à la tâche
    }),
  },
});
const emit = defineEmits(['task-updated', 'close-modal']);

// Données liées à la tâche (pré-remplies avec les données existantes)
const titreTache = ref(props.task.titre);
const description = ref(props.task.description);
const statut = ref(props.task.statut);
const developerId = ref(props.task.developerId || null);
const deadline = ref(props.task.deadline || ''); // Initialisation de la date limite

// Récupérer les développeurs depuis le localStorage
const users = JSON.parse(localStorage.getItem('users')) || [];
const developers = users.filter(user => user.roles && user.roles.includes('Developer'));

// Vérification du rôle de l'utilisateur
const roles = JSON.parse(localStorage.getItem('userRoles')) || [];
const isManager = computed(() => roles.includes('Manager'));

// Fonction pour mettre à jour la tâche
function editerTache() {
  if (!titreTache.value || !description.value || !statut.value || !deadline.value) {
    alert('Veuillez remplir tous les champs.');
    return;
  }

  const tacheMiseAJour = {
    ...props.task,
    titre: titreTache.value,
    description: description.value,
    statut: statut.value,
    developerId: developerId.value,
    deadline: deadline.value, // Ajouter la date limite à la tâche mise à jour
  };

  console.log('Tâche mise à jour:', tacheMiseAJour);
  emit('task-updated', tacheMiseAJour);
  emit('close-modal');
}

// Fonction pour fermer le modal
function closeModal() {
  emit('close-modal');
}
</script>
