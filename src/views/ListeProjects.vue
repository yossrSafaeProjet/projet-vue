<template>
  <div>
    <h1>Mes Projets</h1>

    <!-- Loader si les données sont en cours de chargement -->
    <div v-if="loading">Chargement des projets...</div>

    <!-- Tableau pour afficher les projets -->
    <table v-else-if="projects.length" border="1" width="100%">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="project in projects" :key="project.id">
          <td>{{ project.name }}</td>
          <td>{{ project.description }}</td>
          <td>
            <button @click="goToDashboard(project.id)">Voir le tableau de bord</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Message si aucun projet n'est trouvé -->
    <div v-else>
      Aucun projet créé pour le moment.
    </div>
  </div>
</template>

<script>
export default {
  name: "ListeProjects",
  data() {
    return {
      projects: [],     // Liste des projets
      loading: false,   // Indique si les données sont en cours de chargement
    };
  },
  created() {
    // Récupérer les projets depuis localStorage
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      this.projects = JSON.parse(storedProjects);
    } else {
      this.projects = [];
    }
  },
  methods: {
    // Redirige vers la vue du tableau de bord pour un projet donné
    goToDashboard(projectId) {
      this.$router.push({ name: "project-dashboard", params: { projectId } });
    },
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  margin: 20px 0;
}

th, td {
  padding: 10px;
  text-align: left;
}

button {
  padding: 5px 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}

div {
  margin: 10px 0;
}
</style>
