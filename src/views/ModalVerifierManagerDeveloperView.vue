<template>
    <div>
      <div
        class="modal fade"
        id="roleModal"
        tabindex="-1"
        aria-labelledby="roleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="roleModalLabel">
                Précisez votre rôle
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <p>Si vous souhaitez consulter le projet, précisez votre rôle :</p>
              <div class="form-check">
                <input
                  type="radio"
                  id="roleDeveloper"
                  name="userRole"
                  value="Developer"
                  v-model="selectedRole"
                  class="form-check-input"
                />
                <label for="roleDeveloper" class="form-check-label">
                  Développeur
                </label>
              </div>
              <div class="form-check">
                <input
                  type="radio"
                  id="roleManager"
                  name="userRole"
                  value="Manager"
                  v-model="selectedRole"
                  class="form-check-input"
                />
                <label for="roleManager" class="form-check-label">
                  Manager
                </label>
              </div>
            </div>
  
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Annuler
              </button>
              <button type="button" class="btn btn-primary" @click="confirmRole">
                Confirmer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRoute } from "vue-router";
  
  const selectedRole = ref("");
  const route = useRoute();
  const userId = route.params.userId;
  
  function confirmRole() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
  
    // Vérifier si un rôle est sélectionné
    if (!selectedRole.value) {
      alert("Veuillez sélectionner un rôle !");
      return;
    }
  
    // Recherche de l'utilisateur par ID et validation du rôle
    const user = users.find(
      (user) => user.id === userId && user.roles.includes(selectedRole.value)
    );
  
    if (user) {
      alert(`Vous êtes identifié comme ${selectedRole.value}`);
      // Redirection en fonction du rôle
      if (selectedRole.value === "Developer") {
        window.location.href = `/projetDeveloper/${userId}`;
      } else if (selectedRole.value === "Manager") {
        window.location.href = "/listemanager";
      }
    } else {
      alert("Vous n'avez pas l'autorisation pour ce rôle !");
    }
  }
  </script>
  
  <style scoped>
  .modal-body p {
    margin-bottom: 1rem;
  }
  </style>
  