<template>
    <!-- Popup Bootstrap -->
    <div class="modal fade" id="createTacheModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Créer une tâche</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Formulaire -->
            <form  @submit.prevent="creerTache">
              <div class="form-group row mb-3">
                <label for="titreTache" class="col-sm-4 col-form-label">Titre de la tâche</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" id="titreTache" name="titreTache">
                </div>
              </div>
              <div class="form-group row mb-3">
                <label for="description" class="col-sm-4 col-form-label">Description</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" id="description" name="description">
                </div>
              </div>
              <fieldset class="form-group row mb-3">
                <legend class="col-form-label col-sm-4 pt-0">Statut</legend>
                <div class="col-sm-8">
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="validée">
                    <label class="form-check-label" for="gridRadios1">Validée</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value="non-validée">
                    <label class="form-check-label" for="gridRadios2">Non validée</label>
                  </div>
                </div>
              </fieldset>
              <div class="form-group row">
                <div class="col-sm-12 text-end">
                  <button type="submit" class="btn btn-primary">Créer une tâche</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
 import { ref } from 'vue';
 const taches = ref([]);

// Charger les tâches depuis le localStorage au démarrage
if (localStorage.getItem('taches')) {
  taches.value = JSON.parse(localStorage.getItem('taches'));
}

function creerTache(event) {
  event.preventDefault();
console.log(event.target.titreTache.value)
  // Créer une nouvelle tâche
  const nouveauTache = {
    id: crypto.randomUUID(),
    titre: event.target.titreTache.value,
    description: event.target.description.value,
    statut: event.target.gridRadios.value,
  };

  // Ajouter la nouvelle tâche à la liste
 
  taches.value.push(nouveauTache);
  // Sauvegarder la liste des tâches dans le localStorage
  localStorage.setItem('taches', JSON.stringify(taches.value));
  alert('Tâche bien ajoutée');
 
  // Vider le formulaire
  event.target.reset();
  window.location.href = '/projetDeveloper'; 
}

  </script>
  
  <style>

  </style>
  