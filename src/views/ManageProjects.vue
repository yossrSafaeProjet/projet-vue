<template>
  <div>
    <h1>Gestion des Projets</h1>
    <button @click="showProjectForm = true">Créer un nouveau projet</button>
    
    <!-- Formulaire de création de projet -->
    <div v-if="showProjectForm">
      <form @submit.prevent="createProject">
        <label for="projectName">Nom du projet</label>
        <input type="text" v-model="newProject.name" required />
        <label for="projectDescription">Description</label>
        <textarea v-model="newProject.description" required></textarea>
        
        <button type="submit">Créer le projet</button>
      </form>
    </div>
    
    <!-- Liste des projets -->
    <div v-for="project in projects" :key="project.id">
      <h2>{{ project.name }}</h2>
      <p>{{ project.description }}</p>
      <button @click="editProject(project)">Modifier</button>
      <button @click="deleteProject(project.id)">Supprimer</button>
      <button @click="viewProjectDashboard(project.id)">Voir le tableau de bord</button>
      
      
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      projects: [],  // Liste des projets
      newProject: { 
        name: "", 
        description: "", 
      },
      showProjectForm: false,  // Affichage du formulaire de création de projet
      developers: [  // Liste fictive des développeurs pour affectation
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Smith" },
        { id: 3, name: "Alice Johnson" }
      ],
    };
  },
  methods: {
    // Créer un projet avec ses tâches
    createProject() {
      const newProject = { 
        ...this.newProject, 
        id: Date.now(), 
      };
      this.projects.push(newProject);
      this.newProject = { name: "", description: "" };
      this.showProjectForm = false;
    },

    // Modifier un projet
    editProject(project) {
      this.newProject = { ...project };
      this.showProjectForm = true;
    },

    // Supprimer un projet
    deleteProject(id) {
      this.projects = this.projects.filter((project) => project.id !== id);
    },

    // Voir le tableau de bord du projet
    viewProjectDashboard(projectId) {
      this.$router.push({ name: 'project-dashboard', params: { projectId } });
    },

  },
};
</script>
