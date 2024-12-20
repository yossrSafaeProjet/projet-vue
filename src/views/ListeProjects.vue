<template>
  <div>
    <h1>Mes Projets</h1>
     <button @click="redirige()">Ajouter Project</button>
    <!-- Loader si les données sont en cours de chargement -->
    <div v-if="loading">Chargement des projets...</div>
  
    <!-- Tableau pour afficher les projets -->
    <table v-else-if="projects.length" border="1" width="100%">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Description</th>
          <th>Détails du projet</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="project in projects" :key="project.id">
          <td>{{ project.name }}</td>
          <td>{{ project.description }}</td>
          <td>
            <button @click="goToDashboard(project.id)">Voir les détails du projet</button>
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
      projects: [],  // Liste des projets
      loading: false, // Indique si les données sont en cours de chargement
      userRoles: [],  // Rôles de l'utilisateur
      users: [], // Liste des utilisateurs (avec id et name)
    };
  },
  created() {
    // Récupérer les projets depuis localStorage
    const storedProjects = localStorage.getItem('projects');
        // Récupérer les rôles de l'utilisateur depuis localStorage
    const currentUser = JSON.parse(localStorage.getItem("authenticatedUser"));
    if (storedProjects) {
      this.projects = JSON.parse(storedProjects);
    } else {
      this.projects = [];
    }


    if (currentUser) {
      this.userRoles = currentUser.roles || [];
    }

    // Récupérer la liste des utilisateurs (à adapter selon votre logique de données)
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    }
  },
  methods: {
    redirige()
    {
      const currentUser = JSON.parse(localStorage.getItem("authenticatedUser"));
      const managerId=currentUser.id
      this.$router.push({ name: "ManageProjects",params: { managerId}});
    },
    goToDashboard(projectId) {
      // Vérifiez si l'utilisateur a le rôle de Manager
      console.log(this.userRoles[0]);
      if (this.userRoles[0] == "Manager") {
        this.addManagerToProject(projectId);
      }

      // Rediriger vers la page de détails du projet
      console.log("id",projectId);
      this.$router.push({ name: "Project", params: { projectId } });
    },

    addManagerToProject(projectId) {
      // Vérifiez si les informations de l'utilisateur courant existent
      const currentUser = JSON.parse(localStorage.getItem("authenticatedUser"));
      console.log(currentUser);
      if (!currentUser) {
        console.error("Aucune information utilisateur trouvée.");
        return; // Si aucune information utilisateur n'est trouvée, arrêter l'exécution
      }

      // Chercher le projet correspondant
      const project = this.projects.find(p => p.id === projectId);
      const roles= JSON.parse(localStorage.getItem("userRoles"));
      
      if (project) {
       if (roles.includes("Manager")) {
          // Vérifier si le projet a déjà une liste de managerIds
          if (!project.managerIds) {
            project.managerIds = [];
          }

          console.log("Manager actuel:", currentUser.id);

          // Ajouter l'utilisateur comme Manager s'il n'est pas déjà dans la liste
          if (!project.managerIds.includes(currentUser.id)) {
            project.managerIds.push(currentUser.id);
            console.log(`Utilisateur ${currentUser.id} ajouté à la liste des managers du projet ${project.name}`);
          }

          // Mettre à jour la liste des managers globaux dans localStorage
          const managerIds = JSON.parse(localStorage.getItem("managerIds")) || [];
          if (!managerIds.includes(currentUser.id)) {
            managerIds.push(currentUser.id);
          }

          // Sauvegarder les mises à jour dans le localStorage
          localStorage.setItem("managerIds", JSON.stringify(managerIds));
          localStorage.setItem("projects", JSON.stringify(this.projects));
          console.log("Projets mis à jour:", this.projects);
        }

      } else {
        console.error("Le projet n'a pas été trouvé.");
      }
    },

    // Méthode pour récupérer le nom du manager à partir de l'ID
    getManagerName(managerId) {
      const manager = this.users.find(user => user.id === managerId);
      return manager ? manager.name : 'Nom inconnu';
    }
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
