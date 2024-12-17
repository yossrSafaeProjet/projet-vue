<template>
  <div>
    <h1>Dashboard</h1>

    <!-- Afficher pour Developer uniquement -->
    <div v-if="roles.includes('Developer') && !roles.includes('Manager')">
      <h2>Liste des projets pour Developer</h2>
      <h6>hhhhhhhhhhhhhhhhh</h6>
    </div>

    <!-- Afficher pour Manager uniquement -->
    <div v-if="roles.includes('Manager') && !roles.includes('Developer')">
      <h2>Gestion des projets pour Manager</h2>
      <h6>lo</h6>
    </div>

    <!-- Afficher pour ceux qui ont les deux rôles -->
    <div v-if="roles.includes('Developer') && roles.includes('Manager')">
      <h2>Dashboard complet (Developer + Manager)</h2>
      <!-- Contenu pour Developer et Manager -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roles: []  // Liste des rôles récupérés
    };
  },
  created() {
    // Simuler la récupération des rôles depuis le backend ou le localStorage
    const storedRoles = JSON.parse(localStorage.getItem("userRoles"));
    if (storedRoles && Array.isArray(storedRoles)) {
      this.roles = storedRoles;
    } else {
      console.error("Roles not found or invalid format.");
    }
  }
};
</script>
