<template>
  <div class="container mt-5 register-container">
    <h1>Inscription</h1>
    <form @submit.prevent="handleRegister">
      <!-- Nouveau champ Nom -->
      <div class="mb-3">
      <label for="first-name" class="form-label">Prénom</label>
      <input
        type="text"
        id="first-name"
        v-model="firstName"
        placeholder="Entrez votre prénom"
        required
      />
</div>
      <!-- Nouveau champ Prénom -->
       <div class="mb-3">
      <label for="last-name" class="form-label">Nom</label>
      <input
        type="text"
        id="last-name"
        v-model="lastName"
        placeholder="Entrez votre nom"
        required
      />
</div>
<div class="mb-3">
      <label for="email" class="form-label">Adresse email</label>
      <input type="email" id="email" v-model="email" placeholder="Entrez votre adresse email" required/>
</div>
<div class="mb-3">
      <label for="password" class="form-label">Mot de passe</label>
      <input
        type="password"
        id="password"
        v-model="password"
        placeholder="Entrez votre mot de passe"
        required
      />
</div>
<div class="mb-3">
      <label for="confirm-password" class="form-label">Confirmez votre mot de passe</label>
      <input
        type="password"
        id="confirm-password"
        v-model="confirmPassword"
        placeholder="Confirmez votre mot de passe"
        required
      />
</div>
<div class="mb-3">
      <label for="roles" class="form-label">Choisissez vos rôles</label>
      <div class="form-check">
      <div id="roles">
        <input
            type="checkbox"
            value="Developer"
            v-model="roles"
          
          />
        <label   class="form-check-label">
        
          Développeur
        </label>
        <label>
          <input
            type="checkbox"
            value="Manager"
            v-model="roles"
            class="form-check-label"
          />
          Manager
        </label>
      </div>
      </div>
</div>
      <button type="submit" class="btn btn-primary w-100">S'inscrire</button>
    </form>
    <p class="text-center mt-3">
      Déjà inscrit ? <a href="#" @click="goToLogin">Connectez-vous ici</a>
    </p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      firstName: "",  
      lastName: "",   
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
    // Génère un ID unique pour l'utilisateur
    const newUserId = crypto.randomUUID();

    // Ajoute le nouvel utilisateur avec ses informations
    users.push({
      id: newUserId,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      roles: this.roles,
    });
        // Enregistre les utilisateurs dans le localStorage
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("lastUserId", newUserId);

    // Sauvegarde la liste mise à jour des utilisateurs
    localStorage.setItem("users", JSON.stringify(users));

    // Sauvegarde du dernier ID utilisateur utilisé (si nécessaire)
    localStorage.setItem("lastUserId", newUserId);

    alert("Inscription réussie !");
    // Redirige vers la page de connexion
    this.$router.push("/");
  }
}
,
    goToLogin() {
      this.$router.push("/");
    },
  },
};
</script>
<style scoped>
.register-container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.register-container h1 {
  color: #007bff;
}

.register-container a {
  color: #007bff;
  text-decoration: none;
}

.register-container a:hover {
  text-decoration: underline;
}
</style>