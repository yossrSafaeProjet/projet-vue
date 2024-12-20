<template>
  <div>
    <h1>Vue synthétique des projets</h1>
    <div v-if="managedProjects.length > 0">
      <div v-for="project in managedProjects" :key="project.id" class="project-card">
        <h2>{{ project.name }}</h2>
        <p><strong>Progression globale :</strong> {{ calculateGlobalProgress(project) }}%</p>
        <ul>
          <li v-for="task in project.tasks" :key="task.id">
            <strong>{{ task.titre }}</strong> - Statut : {{ task.statut }} - 
            Deadline : {{ task.deadline | formatDate }}
          </li>
        </ul>
        <p
          :class="{
            'status-delayed': isDelayed(project), 
            'status-at-risk': isAtRisk(project), 
            'status-on-track': !isDelayed(project) && !isAtRisk(project)
          }"
        >
          {{ getRiskStatus(project) }}
        </p>
      </div>
    </div>
    <p v-else>Aucun projet géré pour le moment.</p>
  </div>
</template>

<script>
export default {
  name: "ProjectOverview",
  data() {
    return {
      projects: [], // Les projets seront récupérés depuis localStorage
      currentUser: null, // Utilisateur connecté
    };
  },
  computed: {
    // Filtrer les projets dont l'utilisateur est manager
    managedProjects() {
      return this.projects.filter((project) =>
        project.managerIds?.includes(this.currentUser.id)
      );
    },
  },
  methods: {
    loadProjectsFromLocalStorage() {
      const storedProjects = localStorage.getItem("projects");
      if (storedProjects) {
        this.projects = JSON.parse(storedProjects);
        console.log("Projets chargés:", this.projects);  // Vérifie si les projets sont bien chargés
      } else {
        console.warn("Aucun projet trouvé dans localStorage.");
      }
    },

    // Récupérer l'utilisateur connecté depuis localStorage
    loadCurrentUser() {
      console.log("Utilisateur authentifié:", JSON.parse( localStorage.getItem("authenticatedUser")));
      const authenticatedUser = localStorage.getItem("authenticatedUser");
      if (authenticatedUser) {
        this.currentUser = JSON.parse(authenticatedUser); // On suppose que l'utilisateur est stocké sous forme d'objet
        console.log("Utilisateur authentifié:", this.currentUser); // Vérifie si l'utilisateur est correctement chargé
      } else {
        console.warn("Aucun utilisateur trouvé dans localStorage.");
      }
    },

    // Méthode pour vérifier si un projet est en retard
    isDelayed(project) {
      const now = new Date();
      // Vérifie si au moins une tâche est en retard
      return project.tasks.some(task => {
        const taskDeadline = new Date(task.deadline); // Convertit la deadline en objet Date
        if (task.statut !== "Terminée" && taskDeadline < now) {
          return true; // Tâche en retard
        }
        return false; // Tâche à jour
      });
    },

    // Méthode pour calculer le progrès global d'un projet
    calculateGlobalProgress(project) {
      if (!project.tasks || project.tasks.length === 0) return 0;
      const totalProgress = project.tasks.reduce((sum, task) => sum + (task.progress || 0), 0);
      return (totalProgress / project.tasks.length).toFixed(2);
    },

    // Méthode pour vérifier si un projet est à risque
    isAtRisk(project) {
      const now = new Date();
      return project.tasks.some(task => {
        const taskDeadline = new Date(task.deadline);
        // Vérifie si la tâche n'est pas terminée et si la deadline est proche (moins de 3 jours)
        return (taskDeadline - now) / (1000 * 60 * 60 * 24) < 3; // Moins de 3 jours avant la deadline
      });
    },

    getRiskStatus(project) {
      if (this.isDelayed(project)) return "Projet en retard";
      if (this.isAtRisk(project)) return "Projet à risque";
      return "Projet en bonne santé";
    },
  },
  filters: {
    formatDate(value) {
      if (!value) return "Date non définie";
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(value).toLocaleDateString("fr-FR", options);
    },
  },
  mounted() {
    this.loadCurrentUser(); // Charger l'utilisateur authentifié
    this.loadProjectsFromLocalStorage(); // Charger les projets
  },
};
</script>

<style scoped>
.project-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1em;
  margin-bottom: 1em;
  background-color: #f9f9f9;
}
.status-delayed {
  color: red;
  font-weight: bold;
}
.status-at-risk {
  color: orange;
  font-weight: bold;
}
.status-on-track {
  color: green;
  font-weight: bold;
}
</style>
