<template>
  <div class="register-container">
    <h1>Inscription</h1>
    <form @submit.prevent="handleRegister">
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
        // Ajoute le nouvel utilisateur avec son email, son mot de passe et ses rôles
        users.push({
          email: this.email,
          password: this.password,
          roles: this.roles,
        });
        localStorage.setItem("users", JSON.stringify(users));
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

<style scoped>
.register-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.register-container h1 {
  text-align: center;
  margin-bottom: 20px;
}

.register-container form {
  display: flex;
  flex-direction: column;
}

.register-container label {
  margin-bottom: 5px;
  font-weight: bold;
}

.register-container input[type="text"],
.register-container input[type="email"],
.register-container input[type="password"] {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.register-container input[type="checkbox"] {
  margin-right: 10px;
}

.register-container button {
  background-color: #28a745;
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.register-container button:hover {
  background-color: #218838;
}

#roles {
  margin-bottom: 15px;
}

#roles label {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
</style>
