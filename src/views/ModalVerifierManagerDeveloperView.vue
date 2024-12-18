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

  function confirmRole() {
  // Récupération des données mises à jour depuis le localStorage
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const authenticatedUser = JSON.parse(localStorage.getItem("authenticatedUser")) || null;
  const selectedRole = JSON.parse(localStorage.getItem("userRoles")) || [];
  // Vérification : Si aucun utilisateur authentifié, retourner
  if (!authenticatedUser || !authenticatedUser.id) {
    alert("Utilisateur non authentifié !");
    return;
  }

  // Recherche de l'utilisateur basé sur l'ID et les rôles
  const user = users.find(
    (user) =>{
        user.id === authenticatedUser.id &&
        user.roles[0]===selectedRole[0]
        console.log("1",user.id === authenticatedUser.id)
        console.log("2",user.roles[0]===selectedRole[0])
        console.log("3",user)
        return user;
    }

    
  );
  console.log(user)

  if (user) {
    alert(`Vous êtes identifié comme ${selectedRole}`);
    // Redirection en fonction du rôle
    if (selectedRole[0] === "Developer") {
      window.location.href = `/projetDeveloper/${authenticatedUser.id}`;
    } else if (selectedRole[0]=== "Manager") {
      window.location.href = "/ManageProjects";
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
  