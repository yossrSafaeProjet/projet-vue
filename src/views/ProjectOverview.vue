<template>
  <div>
    <h1>Vue synthétique des projets</h1>
    <div v-if="managedProjects.length > 0">
      <div v-for="project in managedProjects" :key="project.id" class="project-card">
        <h2>{{ project.name }}</h2>

        <!-- Affichage des tâches en cours -->
        <p><strong>Tâches en cours :</strong></p>
        <ul>
            <!-- Vérifier si la liste des tâches en cours est vide -->
            <template v-if="ongoingTasks(project).length === 0">
                <li>Aucune tâche en cours</li>
            </template>
            <!-- Si des tâches en cours sont trouvées, les afficher -->
            <template v-else>
                <li v-for="task in ongoingTasks(project)" :key="task.id">
                <strong>{{ task.titre }}</strong> - 
                Deadline : 
                <span
                    :class="{
                    'deadline-overdue': isDeadlineOverdue(task.deadline),
                    'deadline-upcoming': isDeadlineUpcoming(task.deadline),
                    'deadline-normal': !isDeadlineOverdue(task.deadline) && !isDeadlineUpcoming(task.deadline)
                    }"
                >
                    {{ task.deadline }}
                </span>
                </li>
            </template>
            </ul>


        <!-- Affichage du statut global -->
        <p><strong>Progression globale :</strong> {{ calculateGlobalProgress(project) }}%</p>
        <p>
          <strong>Statut :</strong> 
          <span
            :class="{
              'status-delayed': isDelayed(project), 
              'status-at-risk': isAtRisk(project), 
              'status-on-track': !isDelayed(project) && !isAtRisk(project)
            }"
          >
            {{ getRiskStatus(project) }}
          </span>
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
      }
    },

    loadCurrentUser() {
      const authenticatedUser = localStorage.getItem("authenticatedUser");
      if (authenticatedUser) {
        this.currentUser = JSON.parse(authenticatedUser);
      }
    },

    // Méthode pour retourner les tâches en cours (non complétées ni validées)
        ongoingTasks(project) {
        console.log("okkk", project.tasks.filter(task => task.statut !== "Complétée" && task.statut !== "Validée"));
        return project.tasks.filter(task => task.statut !== "Complétée" && task.statut !== "Validée");
        },


    // Méthode pour calculer le progrès global d'un projet
   calculateGlobalProgress(project) {
        if (!project.tasks || project.tasks.length === 0) return 0;
        
        // Comptabiliser les tâches complétées ou validées
        const completedTasks = project.tasks.filter(task => 
            task.statut === "Complétée" || task.statut === "Validée"
        ).length;

        // Calcul du pourcentage de progression
            return ((completedTasks / project.tasks.length) * 100).toFixed(2);
        },


    isDelayed(project) {
      const now = new Date();
      return project.tasks.some(task => {
        const taskDeadline = new Date(task.deadline);
        return task.statut !== "Complétée" && task.statut !== "Validée" && taskDeadline < now;
      });
    },

    isAtRisk(project) {
      const now = new Date();
      return project.tasks.some(task => {
        const taskDeadline = new Date(task.deadline);
        return (taskDeadline - now) / (1000 * 60 * 60 * 24) < 3 && task.statut !== "Complétée"  && task.statut !== "Validée";
      });
    },

    getRiskStatus(project) {
      if (this.isDelayed(project)) return "Projet en retard";
      if (this.isAtRisk(project)) return "Projet à risque";
      return "Projet en bonne santé";
    },

    isDeadlineOverdue(deadline) {
      const now = new Date();
      return new Date(deadline) < now; // Deadline dépassée
    },

    isDeadlineUpcoming(deadline) {
      const now = new Date();
      const diffInDays = (new Date(deadline) - now) / (1000 * 60 * 60 * 24);
      return diffInDays <= 3 && diffInDays > 0; 
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
    this.loadCurrentUser();
    this.loadProjectsFromLocalStorage();
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
.deadline-overdue {
  color: red;
  font-weight: bold;
}
.deadline-upcoming {
  color: orange;
}
.deadline-normal {
  color: green;
}
</style>
