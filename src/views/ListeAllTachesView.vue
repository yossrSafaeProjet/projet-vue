<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import AjoutCommentaireModalView from './AjoutCommentaireModalView.vue';


// Définition des props
const props = defineProps([ 'showAllTasks']);
const isShowAllTasks = computed(() =>{props.showAllTasks === 'true'});

// Variables réactives
const taches = ref([]);
const projetNom = ref(''); // Pour stocker le nom du projet
const selectedTache = ref(null);

// Récupérer l'ID du projet depuis la route
const route = useRoute();
const projetId = route.params.projetId;
const showAllTasksComplets = computed(() => route.params.showAllTasksComplets === 'true');
const roles= ref([]);
const commentaires = ref([]);
const authenticatedUser = ref(null);
console.log("roles",roles)
const storedProjets = ref([]);

// Récupération des données depuis localStorage lors du montage du composant
onMounted(() => {
  roles.value= JSON.parse(localStorage.getItem('userRoles'));
  isManager();
  console.log("isManager",isManager);
   storedProjets.value= JSON.parse(localStorage.getItem('projects')) || [];
  authenticatedUser.value = JSON.parse(localStorage.getItem('authenticatedUser')) || {};
/*   console.log(props.showAllTasks) */
  if (storedProjets) {
    const project = storedProjets.value.find((p) => p.id === projetId);
    projetNom.value = project.name;
    console.log("task",showAllTasksComplets.value);
    if (showAllTasksComplets.value) {
        // Si showAllTasksComplets est true, afficher uniquement les tâches complétées
        taches.value = project.tasks.filter((tache) => tache.statut == 'Complétée');
      } else if (!isShowAllTasks.value) {
        // Si showAllTasks est false, afficher uniquement les tâches assignées à l'utilisateur
        taches.value = project.tasks.filter(
          (tache) => tache.developerId === authenticatedUser.value.id
        );
      } else {
        // Sinon, afficher toutes les tâches
        taches.value = project.tasks;
      }

  }else{
    alert('Pas de tâches pour ce projet!');
  }

  commentaires.value = JSON.parse(localStorage.getItem('commentaires')) || [];
});


// Fonction pour ajouter un commentaire
function addCommentaire(commentaire) {
  commentaires.value.push(commentaire);
  localStorage.setItem('commentaires', JSON.stringify(commentaires.value));
  alert('Commentaire ajouté avec succès.');
}
function isManager()
{
  roles.value.includes("Manager");
}
// Fonction pour naviguer vers la liste des commentaires d'une tâche
function GoToCommentaireList() {
  window.location.href = `/allCommentaire/${selectedTache.value.id}`;
}

function updateStatus(tache, newStatus) {
  // Met à jour le statut de la tâche
  tache.statut = newStatus;

  // Récupère le projet auquel appartient la tâche
  const project = storedProjets.value.find((p) => p.tasks.includes(tache));
  if (project) {
    // Met à jour les projets dans le localStorage
    localStorage.setItem("projects", JSON.stringify(storedProjets.value));
    alert(`Statut de la tâche "${tache.titre}" mis à jour en "${newStatus}"`);
  } else {
    console.error("Tâche non trouvée dans un projet.");
  }
}
 function Retourner(){
  window.location.href="/dashboard"
 }
</script>

<template>

  <h1  class="page-title">Liste des tâches associées au projet {{ projetNom }}</h1>
  <button @click="Retourner" >Retour</button>
  <div class="card-container">

  <div v-for="(tache, i) in taches" :key="tache.id" class="card mb-3" style="width: 18rem;">
    <div class="card-body">
      <h5 class="card-title">Tâche {{ i + 1 }}</h5>
      <div class="card-content">
        <div class="field">
          <span class="field-label">Nom de la tâche :</span>
          <span class="field-value">{{ tache.titre }}</span>
        </div>
        <div class="field">
          <span class="field-label">Description :</span>
          <span class="field-value">{{ tache.description }}</span>
        </div>
        <div class="field">
          <span class="field-label">Développeur Affecté :</span>
          <span class="field-value">{{ tache.developper }}</span>
        </div>
        <div class="field">
          <div class="field-container">
          <span class="field-label">Statut :</span>
        <select 
          v-if="isManager"
          id="status-select"
          class="form-select"
          v-model="tache.statut"
          @change="updateStatus(tache, tache.statut)"
          :style="{
            backgroundColor: tache.statut === 'Validée' ? '#81c784' : '#ffeb3b', 
            borderColor: tache.statut === 'Validée' ? '#388e3c' : '#00796b'
          }"
        >
        <option value="Validée">Validée</option>
        </select>
        <select
          v-else="!isManager"
          id="status-select"
          class="form-select"
          v-model="tache.statut"
          @change="updateStatus(tache, tache.statut)"
          :style="{
            backgroundColor: tache.statut === 'Complétée' ? '#81c784' : '#ffeb3b', 
            borderColor: tache.statut === 'Complétée' ? '#388e3c' : '#00796b'
          }"
        >
          <option value="en cours">En cours</option>
          <option value="Complétée">Complétée</option>
        </select>
        
      </div>
    </div>
  </div>

      <!-- Premier bouton : Ajouter un commentaire -->
      <button
        class="btn btn-primary custom-btn"
        data-bs-toggle="modal"
        data-bs-target="#AjoutCommentaireModalView"
        @click="selectedTache = tache">
        Ajouter un commentaire
      </button>

      <!-- Modal pour ajouter un commentaire -->
      <AjoutCommentaireModalView
        :tache="selectedTache"
        @commentaire-created="addCommentaire" 
      />

      <!-- Deuxième bouton : Voir les commentaires -->
      <button
        class="btn btn-primary custom-btn"
        @click="selectedTache = tache; GoToCommentaireList()">
        Voir les commentaires
      </button>

    </div>
  </div>
  </div>
</template>
<style src="@/assets/sharedStyle.css"></style>
<style scoped>

.form-label {
  font-weight: bold;
  color: #333;
}

.form-select {
  margin-top: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  padding: 0.5rem;
  background-color: #f9f9f9; 
}

#status-select {
  margin-top: 0.5rem;
  background-color: #e0f7fa; 
  border-color: #00796b;
}

.card-body select[ng-model="status"] {
  background-color: #ffeb3b; 
}

.card-body select[ng-model="status"]:valid {
  background-color: #81c784;
  border-color: #388e3c; 
}

</style>
