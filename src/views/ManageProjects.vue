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
    <div v-for="project in this.projects" :key="project.id">
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
          <li v-for="task in project.tasks" :key="task.id">
            {{ task.titre }} - {{ task.statut }}
            <button @click="deleteTask(task.id, project)">Supprimer</button>
            <button @click="editTask(task, project)">Modifier</button>

            <!-- Composant d'édition de tâche -->
            <EditTask
              v-if="editingTaskId === task.id"
              :task="task"
              @task-updated="updateTaskInProject"
              @close-modal="closeTaskModal"
            />
          </li>
        </ul>
      </div>
    </div>

    <!-- Modal pour les tâches -->
    <CreateTacheModalView 
      v-if="!editingTaskId" 
      :project="selectedProject"
      :task="selectedTask"
      @task-created="addTaskToProject"
      @close-modal="closeTaskModal"
    />
  </div>
</template>
<script>
import { ref } from 'vue';
import CreateTacheModalView from './CreateTacheModalView.vue';
import EditTask from './EditTask.vue';

export default {
  components: {
    CreateTacheModalView,
    EditTask,
  },
  data() {
    return {
      projects: [], // Liste des projets
      newProject: { name: "", description: "" },
      showProjectForm: false,
      editingProjectId: null, // ID du projet en cours de modification
      selectedProject: null,
      selectedTask: null,
      editingTaskId: null,
      managerIds: [], // Liste des identifiants des managers
    };
  },
  mounted() {
    this.loadProjects();
    this.recupererManagerIds();
  },
  computed: {
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
        console.warn('Aucun ID de managers trouvé.');
      }
    },
    saveProject() {
      if (this.editingProjectId) {
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
          managers: this.managerIds, // Assignation de tous les managers
        };
        this.projects.push(newProject); // Mise à jour du tableau de projets
      }

      this.saveProjects(); // Sauvegarde dans localStorage
      this.loadProjects(); // Recharge les projets pour forcer un rafraîchissement de la vue
      this.resetForm();
    },
    editProject(project) {
      this.newProject = { name: project.name, description: project.description };
      this.editingProjectId = project.id;
      this.showProjectForm = true;
    },
    deleteProject(id) {
      this.projects = this.projects.filter((project) => project.id !== id);
      this.saveProjects();
    },
    saveProjects() {
      localStorage.setItem('projects', JSON.stringify(this.projects)); // Sauvegarde dans localStorage
    },
    loadProjects() {
      const storedProjects = localStorage.getItem('projects');
      if (storedProjects) {
        this.projects = JSON.parse(storedProjects).map(project => ({
          ...project,
          tasks: Array.isArray(project.tasks) ? project.tasks : [],
        }));
      }
    },
    resetForm() {
      this.newProject = { name: "", description: "" };
      this.showProjectForm = false;
      this.editingProjectId = null;
    },
    cancelEdit() {
      this.resetForm();
    },
    deleteTask(taskId, project) {
      project.tasks = project.tasks.filter(task => task.id !== taskId);
      this.saveProjects();
    },
    editTask(task, project) {
      this.selectedProject = project;
      this.selectedTask = { ...task }; // Copie de la tâche pour éviter les modifications directes
      this.editingTaskId = task.id; // Active l'édition pour cette tâche
    },
    updateTaskInProject(updatedTask) {
      const project = this.projects.find(p => p.id === this.selectedProject.id);
      if (project) {
        const taskIndex = project.tasks.findIndex(task => task.id === updatedTask.id);
        if (taskIndex !== -1) {
          project.tasks[taskIndex] = updatedTask;
          this.saveProjects();
        }
      }
      this.closeTaskModal();
    },
    openCreateTaskModal(project) {
      this.selectedProject = project;
      this.selectedTask = null;
      this.editingTaskId = null;
    },
    addTaskToProject(task) {
      const project = this.projects.find(p => p.id === this.selectedProject.id);
      if (project) {
        project.tasks.push(task);
      }
      this.saveProjects();
      this.closeTaskModal();
    },
    closeTaskModal() {
      this.selectedProject = null;
      this.selectedTask = null;
      this.editingTaskId = null;
    },
  },
};
</script>
