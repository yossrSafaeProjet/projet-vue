<template>
  <div class="register-container">
    <h1>Inscription</h1>
    <form @submit.prevent="handleRegister">
      <!-- Nouveau champ Nom -->
      <label for="first-name">Prénom</label>
      <input
        type="text"
        id="first-name"
        v-model="firstName"
        placeholder="Entrez votre prénom"
        required
      />

      <!-- Nouveau champ Prénom -->
      <label for="last-name">Nom</label>
      <input
        type="text"
        id="last-name"
        v-model="lastName"
        placeholder="Entrez votre nom"
        required
      />

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

      <label for="confirm-password">Confirmez votre mot de passe</label>
      <input
        type="password"
        id="confirm-password"
        v-model="confirmPassword"
        placeholder="Confirmez votre mot de passe"
        required
      />

      <label for="roles">Choisissez vos rôles</label>
      <div id="roles">
        <label>
          <input
            type="checkbox"
            value="Developer"
            v-model="roles"
          />
          Développeur
        </label>
        <label>
          <input
            type="checkbox"
            value="Manager"
            v-model="roles"
          />
          Manager
        </label>
      </div>

      <button type="submit">S'inscrire</button>
    </form>
    <p>
      Déjà inscrit ? <a href="#" @click="goToLogin">Connectez-vous ici</a>
    </p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      firstName: "",  // Nouveau champ prénom
      lastName: "",   // Nouveau champ nom
      email: "",
      password: "",
      confirmPassword: "", 
      roles: [],
    };
  },
  methods: {
    handleRegister() {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const userExists = users.some((user) => user.email === this.email);

      if (userExists) {
        alert("Cet email est déjà utilisé !");
      } else if (this.roles.length === 0) {
        alert("Veuillez sélectionner au moins un rôle !");
      } else if (this.password !== this.confirmPassword) {
        alert("Les mots de passe ne correspondent pas !");
      } else {
        const userId = crypto.randomUUID();
        // Ajoute le nouvel utilisateur avec son email, son mot de passe et ses rôles
        users.push({
          id:userId,
          email: this.email,
          password: this.password,
          roles: this.roles,
        });

        // Enregistre les utilisateurs dans le localStorage
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("lastUserId", newUserId);  // Sauvegarde du dernier ID utilisateur utilisé

        alert("Inscription réussie !");
        // Redirige vers la page de connexion
        this.$router.push("/");
      }
    },
    goToLogin() {
      this.$router.push("/");
    },
  },
};
</script>
