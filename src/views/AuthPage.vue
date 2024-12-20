<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4 shadow-sm" style="width: 100%; max-width: 400px;">
      <h1 class="text-center mb-4">Connexion</h1>
      <form @submit.prevent="handleLogin">
        <!-- Email -->
        <div class="mb-3">
          <label for="email" class="form-label">Adresse email</label>
          <input
            type="email"
            id="email"
            class="form-control"
            v-model="email"
            placeholder="Entrez votre adresse email"
            required
          />
        </div>

        <!-- Mot de passe -->
        <div class="mb-3">
          <label for="password" class="form-label">Mot de passe</label>
          <input
            type="password"
            id="password"
            class="form-control"
            v-model="password"
            placeholder="Entrez votre mot de passe"
            required
          />
        </div>

        <!-- Bouton de connexion -->
        <div class="d-grid mb-3">
          <button type="submit" class="btn btn-primary">Se connecter</button>
        </div>
      </form>

      <!-- Lien d'inscription -->
      <p class="text-center mt-3">
        Pas encore inscrit ? 
        <a href="#" @click="goToRegister" class="text-decoration-none">Inscrivez-vous ici</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    handleLogin() {
      console.log("Email: ", this.email);  // Vérifier que l'email est bien récupéré
      console.log("Password: ", this.password);  // Vérifier que le mot de passe est bien récupéré

      const users = JSON.parse(localStorage.getItem("users")) || [];

      // Recherche de l'utilisateur
      const user = users.find(
        (user) => user.email === this.email && user.password === this.password
      );

     if (user) {
        alert("Connexion réussie !");
        const { id,email,password, firstName, lastName, roles } = user;
         localStorage.setItem("firstName", JSON.stringify({  firstName}));
        // Sauvegarde dans le localStorage
        localStorage.setItem("authenticatedUser", JSON.stringify({ id,email,password, firstName, lastName, roles }));
        localStorage.setItem("userRoles", JSON.stringify(roles));
        console.log("authenticatedUser",JSON.parse(localStorage.getItem("authenticatedUser")));
        if (roles.includes("Manager")) {
            // Récupérer la liste existante ou initialiser un tableau vide
            //const managerIds = JSON.parse(localStorage.getItem("managerIds")) || [];
            
            // Ajouter le nouvel ID à la liste (éviter les doublons si nécessaire)
            //if (!managerIds.includes(id)) {
                //managerIds.push(id);
            //}
            
            // Mettre à jour localStorage avec la liste mise à jour
           // localStorage.setItem("managerIds", JSON.stringify(managerIds));
     }      
    // Redirection vers le dashboard
    this.$router.push("/dashboard");
  } else {
    alert("Nom d'utilisateur ou mot de passe incorrect !");
  }},
    goToRegister() {
      this.$router.push("/register");
    },
  },
};
</script>

<style scoped>
/* Style inchangé */
</style>
