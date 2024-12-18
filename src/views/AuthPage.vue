<template>
  <div class="login-container">
    <h1>Connexion</h1>
    <form @submit.prevent="handleLogin">
      <label for="email">Adresse email</label>
      <input
        type="email"
        id="email"
        v-model="email"
        placeholder="Entrez votre adresse email"
        required
      />

      <label for="password">Mot de passe</label>
      <input
        type="password"
        id="password"
        v-model="password"
        placeholder="Entrez votre mot de passe"
        required
      />

      <button type="submit">Se connecter</button>
    </form>
    <p>
      Pas encore inscrit ? <a href="#" @click="goToRegister">Inscrivez-vous ici</a>
    </p>
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
        console.log(user);  // Vérifie la structure de l'objet 'user'
        localStorage.setItem("authenticatedUser", JSON.stringify(user));
        localStorage.setItem("userRoles", JSON.stringify(user.roles));

         // Si l'utilisateur est un manager, on stocke son ID
            if (user.roles && user.roles.includes('Manager')) {
            console.log('ID du manager:', user.id);  // Vérifie que l'ID est récupéré correctement
            if (user.id) {
                localStorage.setItem("managerId", user.id);  // Stocke l'ID du manager
            } else {
                console.error('ID du manager non trouvé');
            }
            }
            this.$router.push("/dashboard");
      } else {
        alert("Nom d'utilisateur ou mot de passe incorrect !");
      }
    },
    goToRegister() {
      this.$router.push("/register");
    },
  },
};
</script>

<style scoped>
/* Style inchangé */
</style>
