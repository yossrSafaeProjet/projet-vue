<template>
  <!-- Popup Bootstrap -->
  <div
    class="modal fade"
    id="createTacheModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Créer une tâche</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <!-- Formulaire -->
          <form @submit.prevent="creerTache">
            <div class="form-group row mb-3">
              <label for="titreTache" class="col-sm-4 col-form-label"
                >Titre de la tâche</label
              >
              <div class="col-sm-8">
                <input
                  type="text"
                  class="form-control"
                  id="titreTache"
                  v-model="titreTache"
                  required
                />
              </div>
            </div>
            <div class="form-group row mb-3">
              <label for="description" class="col-sm-4 col-form-label"
                >Description</label
              >
              <div class="col-sm-8">
                <input
                  type="text"
                  class="form-control"
                  id="description"
                  v-model="description"
                  required
                />
              </div>
            </div>

            <!-- Afficher le sélecteur de développeur si c'est un manager -->
            <div v-if="isManager" class="form-group row mb-3">
              <label for="developer" class="col-sm-4 col-form-label"
                >Assigner à un développeur</label
              >
              <div class="col-sm-8">
                <select class="form-control" v-model="developerId" required>
                  <option>Non affectée</option>
                  <option
                    v-for="developer in developers"
                    :key="developer.id"
                    :value="developer.id"
                  >
                    {{ developer.firstName }} {{ developer.lastName }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Champ pour la date limite -->
            <div class="form-group row mb-3">
              <label for="deadline" class="col-sm-4 col-form-label"
                >Date limite</label
              >
              <div class="col-sm-8">
                <input
                  type="date"
                  class="form-control"
                  id="deadline"
                  v-model="deadline"
                  required
                />
              </div>
            </div>

            <fieldset class="form-group row mb-3">
              <legend class="col-form-label col-sm-4 pt-0">Statut</legend>
              <div class="col-sm-8">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    id="valid"
                    value="Validée"
                    v-model="statut"
                    :disabled="isManager"
                  />
                  <label class="form-check-label" for="valid">Validée</label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    id="non-valid"
                    value="Non-validée"
                    v-model="statut"
                    :disabled="!isManager"
                  />
                  <label class="form-check-label" for="non-valid"
                    >Non validée</label
                  >
                </div>
              </div>
            </fieldset>

            <div class="form-group row">
              <div class="col-sm-12 text-end">
                <button type="submit" class="btn btn-primary">
                  Créer une tâche
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// Récupérer les utilisateurs depuis le localStorage
const users = JSON.parse(localStorage.getItem("users")) || [];
const developers = users.filter(
  (user) => user.roles && user.roles.includes("Developer")
);

const props = defineProps({
  project: {
    type: Object, // ou Array selon la structure de ton projet
    required: true, // Si tu veux que cette prop soit obligatoire
  },
});

// Émettre les événements
const emit = defineEmits(["task-created", "close-modal"]);

// Données liées à la tâche
const titreTache = ref("");
const description = ref("");
const statut = ref("");
const developerId = ref(null);
const deadline = ref(""); // Ajout de la date limite

// Vérification du rôle de l'utilisateur pour savoir s'il est manager
const roles = JSON.parse(localStorage.getItem("userRoles")) || []; // Récupère les rôles depuis le localStorage
const isManager = computed(() => roles.includes("Manager"));

// Définir le statut automatiquement selon le rôle
onMounted(() => {
  if (isManager.value) {
    statut.value = "Validée"; // Pour les managers, le statut est validé par défaut
  } else {
    statut.value = "Non-validée"; // Pour les développeurs, le statut est non validé par défaut
  }
});

// Lors de la création de la tâche
function creerTache() {
  if (!titreTache.value || !description.value || !statut.value || !deadline.value) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  const nouvelleTache = {
    id: crypto.randomUUID(),
    titre: titreTache.value,
    description: description.value,
    statut: statut.value,
    developerId: developerId.value || null,
    deadline: deadline.value, // Ajout de la date limite
  };

  console.log("Nouvelle tâche créée:", nouvelleTache); // Vérifiez la tâche créée
  emit("task-created", nouvelleTache);
  emit("close-modal");
}
</script>
