<template>
  <div>


    <h1 class="mb-4">Gestion des Projets</h1>
    <button class="btn btn-primary mb-4" @click="showProjectForm = true">Créer un nouveau projet</button>
    
    <!-- Formulaire de création / modification de projet -->
    <div class="card-container">
    <div v-if="showProjectForm" class="card mb-3">
      
      <form @submit.prevent="saveProject">
        <div class="mb-3">
        <label for="projectName" class="form-label">Nom du projet</label>
        <input type="text" v-model="newProject.name" required class="form-control"  />
        </div>
        <div class="mb-3">
        <label for="projectDescription" class="form-label">Description</label>
        <textarea v-model="newProject.description"  required class="form-control" ></textarea>
        </div>
        <div class="d-flex justify-content-between">
        <button type="submit"  class="btn btn-success">
          {{ editingProjectId ? 'Modifier le projet' : 'Créer le projet' }}
        </button>
        <button type="button" class="btn btn-secondary" @click="cancelEdit">Annuler</button>
      </div>
      </form>
    </div>
    
    <!-- Liste des projets attribués au manager -->
    <div v-for="project in projectsManager" :key="project.id" class="card p-4">
      <div class="field">
          <span class="field-label">Nom du projet :</span>
          <span class="field-value">{{ project.name }}</span>
        </div>
        <div class="field">
          <span class="field-label">Description :</span>
          <span class="field-value">{{ project.description }}</span>
        </div>
      
      <button  class="btn btn-warning"@click="editProject(project)">Modifier</button>
      <button  class="btn btn-danger" @click="deleteProject(project.id)">Supprimer</button>
      <button  class="btn btn-info"
      data-bs-toggle="modal"
      data-bs-target="#createTacheModal" 
      @click="openCreateTaskModal(project)">Ajouter une tâche</button>
      
      <!-- Liste des tâches -->
      <div v-if="project.tasks && project.tasks.length">
        <span class="field-span">La liste des taches associées</span>
        <ul class="list-group mt-2">
          <li v-for="task in project.tasks" :key="task.id" class="list-group-item">
            <div class="field  mb-3">
          <span class="field-label">Titre de la tache  :</span>
          <span class="field-value">{{task.titre }}</span>
        </div>
        
        <div class="field">
          <span class="field-label">Statut de la tache :</span>
          <span class="field-value">{{task.statut }}</span>
        </div>
            </li>
        </ul>
      </div>
    </div>
    <CreateTacheModalView 
        
        :project="selectedProject" 
        @task-created="addTaskToProject" 
       
    />

  </div>
  <!--<router-link :to="{ name: 'ListeProjects' }" class="btn btn-link mt-3">Retour</router-link>-->
</div>

</template>
<script>
import CreateTacheModalView from './CreateTacheModalView.vue';

export default {
  components: {
    CreateTacheModalView,
  },
  data() {
    return {
      projects: [],  // Liste des projets
      newProject: { name: "", description: "" },
      showProjectForm: false,
      editingProjectId: null, // ID du projet en cours de modification
      selectedProject: null,
      managerIds:[],
      managerId: null,
      authenticatedUser:null,
      projectsManager:[] // Identifiant du manager
    };
  },
  mounted() {
     this.authenticatedUser = JSON.parse(localStorage.getItem('authenticatedUser'));
     this.projects = JSON.parse(localStorage.getItem('projects'))||[];  
     this.recupererManagerIds();
    console.log("lkjh",this.managerIds);
    // Charger les projets depuis localStorage lors du montage du composant

    this.loadProjects();
    // Récupérer l'identifiant du manager depuis le localStorage
  },
  computed: {
    // Filtrer les projets pour n'afficher que ceux attribués au manager
    filteredProjects() {
      if (!this.managerIds.length || !Array.isArray(this.projects)) {
        return []; // Retourne un tableau vide si managerIds ou projects sont invalides
      }
      return this.projects.filter(project => 
        Array.isArray(project.managers) &&
        project.managers.some(managerId => this.managerIds.includes(managerId))
      );
    },
  },
  methods: {
     recupererManagerIds() {
  const storedManagerIds = localStorage.getItem('managerIds');
  if (storedManagerIds) {
    this.managerIds = JSON.parse(storedManagerIds);
  } else {
    console.warn('Aucun ID de managers trouvé. Initialisation avec un tableau vide.');
    this.managerIds = []; // Initialisation avec un tableau vide si aucune donnée n'est trouvée
  }
},
    // Sauvegarder un projet (création ou modification)
    saveProject() {
      const managerIds = localStorage.getItem('managerIds');
      if (this.editingProjectId) {
        // Modification existante
        const project = this.projects.find(p => p.id === this.editingProjectId);
        if (project) {
          project.name = this.newProject.name;
          project.description = this.newProject.description;
        }
      } else {
        const newProject = {
          ...this.newProject,
          id: crypto.randomUUID(), 
          tasks: [],
          managerIds: [...this.managerIds],
          managerId: this.authenticatedUser.id, 
        };  
        if (!newProject.managerIds.includes(this.authenticatedUser.id)) {
            newProject.managerIds.push(this.authenticatedUser.id);
        }
        this.projects.push(newProject);

      }

      // Sauvegarder les projets dans le localStorage
      this.saveProjects();

      this.resetForm();
       this.managerIds = [];
    },

    // Modifier un projet
    editProject(project) {
      this.newProject = { name: project.name, description: project.description };
      this.editingProjectId = project.id;
      this.showProjectForm = true;
    },

    // Supprimer un projet
    deleteProject(id) {
  // Filtrer les projets pour retirer celui avec l'ID donné
  this.projects = this.projects.filter((project) => project.id !== id);
  this.projectsManager = this.projects;
  this.saveProjects();
},


 saveProjects() {
    if (this.authenticatedUser) {
      const storedProjects = JSON.parse(localStorage.getItem('projects')) || [];
      
      // Retirer les projets de ce manager pour éviter les doublons
      const filteredProjects = storedProjects.filter(
        (project) => project.managerId !== this.authenticatedUser.id
      );
      
      // Ajouter les projets actuels du manager
      const updatedProjects = [...filteredProjects, ...this.projects];
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      
    }
  },

    loadProjects() {
    if (this.authenticatedUser) {
      const storedProjects = JSON.parse(localStorage.getItem('projects')) || [];
      
      // Filtrer pour obtenir uniquement les projets du manager connecté
      this.projects = storedProjects.filter(
        (project) => project.managerId === this.authenticatedUser.id
      );
      this.projectsManager = this.projects; 
    }
  },

    // Réinitialiser le formulaire
    resetForm() {
      this.newProject = { name: "", description: "" };
      this.showProjectForm = false;
      this.editingProjectId = null;
    },

    // Annuler la modification
    cancelEdit() {
      this.resetForm();
    },

    // Voir le tableau de bord du projet
    viewProjectDashboard(projectId) {
      this.$router.push({ name: 'project-dashboard', params: { projectId } });
    },

    // Ouvrir la modal pour ajouter une tâche
    openCreateTaskModal(project) {
      this.selectedProject = project;
    },

    // Ajouter une tâche au projet
    addTaskToProject(task) {
      const project = this.projects.find(p => p.id === this.selectedProject.id);
      if (project) project.tasks.push(task);
      // Sauvegarder les projets avec la nouvelle tâche
      this.saveProjects();
      this.selectedProject = null;
    },
  },
};
</script>
<style scoped>
.container {
  max-width: 800px;
}

.card {
  background-color: #f9f9f9;
}

.list-group-item {
  display: flex;
  justify-content: space-between;
}
.field-span{
  color: blueviolet;
}
</style>
<style src="@/assets/sharedStyle.css"></style> 