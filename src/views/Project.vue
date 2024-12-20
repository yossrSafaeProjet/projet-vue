<template>
  <div>
    <h1>Le projet sélectionné</h1>

    <!-- Projet sélectionné -->
    <div v-if="selectedProject" :key="selectedProject.id">
      <button @click="goToTacheComplite(selectedProject.id)">Voir les tâches complétées</button>
      <h2>{{ selectedProject.name }}</h2>
      <p>{{ selectedProject.description }}</p>
      <button @click="editProject(selectedProject)">Modifier le projet</button>
      <button @click="deleteProject(selectedProject.id)">Supprimer le projet</button>
      <button
        data-bs-toggle="modal"
        data-bs-target="#createTacheModal"
        @click="openCreateTaskModal(selectedProject)"
      >
        Ajouter une tâche
      </button>

      <!-- Liste des tâches -->
      <div v-if="selectedProject.tasks && selectedProject.tasks.length">
        <ul>
          <li v-for="task in selectedProject.tasks" :key="task.id">
            {{ task.titre }} - {{ task.statut }}
            <button @click="deleteTask(task.id, selectedProject)">Supprimer</button>
            <button @click="editTask(task, selectedProject)">Modifier</button>

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

    <!-- Formulaire de modification de projet -->
    <div v-if="showProjectForm">
      <h3>Modifier le projet</h3>
      <form @submit.prevent="saveProject">
        <div>
          <label for="projectName">Nom du projet</label>
          <input
            type="text"
            id="projectName"
            v-model="editedProject.name"
            required
          />
        </div>
        <div>
          <label for="projectDescription">Description du projet</label>
          <textarea
            id="projectDescription"
            v-model="editedProject.description"
            required
          ></textarea>
        </div>
        <div>
          <button type="submit">Sauvegarder les modifications</button>
          <button type="button" @click="cancelEdit">Annuler</button>
        </div>
      </form>
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
import CreateTacheModalView from "./CreateTacheModalView.vue";
import EditTask from "./EditTask.vue";

export default {
  components: {
    CreateTacheModalView,
    EditTask,
  },
  data() {
    return {
      projects: [], // Liste des projets
      selectedProject: null, // Projet sélectionné
      selectedTask: null,
      editingTaskId: null,
      showProjectForm: false, // Afficher ou non le formulaire de modification
      editedProject: null, // Contient les données modifiées temporairement
    };
  },
  mounted() {
    this.loadProjects();

    const projectId = this.$route.params.projectId;
    if (projectId) {
      this.selectedProject = this.projects.find(
        (project) => project.id === projectId
      );
      if (this.selectedProject) {
        this.editedProject = { ...this.selectedProject }; // Sauvegarder l'état initial avant modification
      } else {
        console.log("Aucun projet trouvé avec l'ID:", projectId);
      }
    }
  },
  methods: {
    goToTacheComplite(idProject) {
      console.log("Navigating to project with ID:", idProject);
      this.$router.push({
        name: "allTaches", 
        params: { projetId: idProject, showAllTasks: false,showAllTasksComplets:true },
    });
    },
    loadProjects() {
      const storedProjects = localStorage.getItem("projects");
      if (storedProjects) {
        this.projects = JSON.parse(storedProjects).map((project) => ({
          ...project,
          tasks: Array.isArray(project.tasks) ? project.tasks : [],
        }));
      }
    },
    saveProjects() {
      localStorage.setItem("projects", JSON.stringify(this.projects));
    },
    deleteProject(id) {
      this.projects = this.projects.filter((project) => project.id !== id);
      this.saveProjects();
      this.selectedProject = null; // Désélectionner après suppression
    },
    editProject(project) {
      this.showProjectForm = true;
      this.editedProject = { ...project }; // Sauvegarder une copie avant modification
    },
    cancelEdit() {
      this.showProjectForm = false;
      this.editedProject = { ...this.selectedProject }; // Rétablir l'état initial
    },
    saveProject() {
      Object.assign(this.selectedProject, this.editedProject); // Appliquer les modifications
      this.saveProjects();
      this.showProjectForm = false;
    },
    deleteTask(taskId, project) {
      project.tasks = project.tasks.filter((task) => task.id !== taskId);
      this.saveProjects();
    },
    editTask(task, project) {
      this.selectedProject = project;
      this.selectedTask = { ...task };
      this.editingTaskId = task.id;
    },
    updateTaskInProject(updatedTask) {
      const project = this.projects.find(
        (p) => p.id === this.selectedProject.id
      );
      if (project) {
        const taskIndex = project.tasks.findIndex(
          (task) => task.id === updatedTask.id
        );
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
      const project = this.projects.find(
        (p) => p.id === this.selectedProject.id
      );
      if (project) {
        project.tasks.push(task);
        this.saveProjects();
        this.closeTaskModal();
      }
    },
    closeTaskModal() {
      this.selectedTask = null;
      this.editingTaskId = null;
    },
  },
};
</script>
