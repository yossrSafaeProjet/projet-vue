<template>
  <div>
    <h1>Gestion des Projets</h1>
    <button @click="showProjectForm = true">Créer un nouveau projet</button>
    
    <!-- Formulaire de création / modification de projet -->
    <div v-if="showProjectForm">
      <form @submit.prevent="saveProject">
        <label for="projectName">Nom du projet</label>
        <input type="text" v-model="newProject.name" required />
        <label for="projectDescription">Description</label>
        <textarea v-model="newProject.description" required></textarea>
        
        <button type="submit">
          {{ editingProjectId ? 'Modifier le projet' : 'Créer le projet' }}
        </button>
        <button type="button" @click="cancelEdit">Annuler</button>
      </form>
    </div>
    
    <!-- Liste des projets attribués au manager -->
    <div v-for="project in filteredProjects" :key="project.id">
      <h2>{{ project.name }}</h2>
      <p>{{ project.description }}</p>
      <button @click="editProject(project)">Modifier</button>
      <button @click="deleteProject(project.id)">Supprimer</button>
      <button
      data-bs-toggle="modal"
      data-bs-target="#createTacheModal" 
      @click="openCreateTaskModal(project)">Ajouter une tâche</button>
      
      <!-- Liste des tâches -->
      <div v-if="project.tasks && project.tasks.length">
        <ul>
          <li v-for="task in project.tasks" :key="task.id">{{ task.titre }} - {{ task.statut }}</li>
        </ul>
      </div>
    </div>
    <CreateTacheModalView 
        
        :project="selectedProject" 
        @task-created="addTaskToProject" 
       
    />

  </div>
  <router-link :to="{ name: 'ListeProjects' }">Voir les projets</router-link>
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
      managerId: null, // Identifiant du manager
    };
  },
  mounted() {
    // Charger les projets depuis localStorage lors du montage du composant
    this.loadProjects();
    // Récupérer l'identifiant du manager depuis le localStorage
    this.recupererManagerId();
  },
  computed: {
    // Filtrer les projets pour n'afficher que ceux attribués au manager
    filteredProjects() {
      return this.projects.filter(project => project.managerId === this.managerId);
    },
  },
  methods: {
    recupererManagerId() {
      // Récupérer l'ID du manager depuis localStorage
      const managerId = localStorage.getItem('managerId');
      
      if (managerId) {
        this.managerId = managerId;  // Assigner l'ID du manager à la variable
        console.log('ID du manager récupéré:', this.managerId);
      } else {
        console.log('Aucun ID de manager trouvé.');
      }
    },
    // Sauvegarder un projet (création ou modification)
    saveProject() {
      if (this.editingProjectId) {
        // Modification existante
        const project = this.projects.find(p => p.id === this.editingProjectId);
        if (project) {
          project.name = this.newProject.name;
          project.description = this.newProject.description;
        }
      } else {
        // Création d'un nouveau projet
        const newProject = {
          ...this.newProject,
          id: crypto.randomUUID(), 
          tasks: [],
          managerId: this.managerId, // Associer le projet au manager
        };
        this.projects.push(newProject);
      }

      // Sauvegarder les projets dans le localStorage
      this.saveProjects();

      this.resetForm();
    },

    // Modifier un projet
    editProject(project) {
      this.newProject = { name: project.name, description: project.description };
      this.editingProjectId = project.id;
      this.showProjectForm = true;
    },

    // Supprimer un projet
    deleteProject(id) {
      this.projects = this.projects.filter((project) => project.id !== id);
      // Sauvegarder les projets mis à jour dans le localStorage
      this.saveProjects();
    },

    // Sauvegarder les projets dans le localStorage
    saveProjects() {
      localStorage.setItem('projects', JSON.stringify(this.projects));
    },

    // Charger les projets depuis le localStorage
    loadProjects() {
      const storedProjects = localStorage.getItem('projects');
      if (storedProjects) {
        this.projects = JSON.parse(storedProjects);
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
