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
import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";
import { useRouter } from 'vue-router';
export default {
  setup() {
    const authStore = useAuthStore();
    const email = ref("");
    const password = ref("");
    const router = useRouter();

    const handleLogin = () => {
      console.log("Email:", email.value); // Vérification
      console.log("Password:", password.value);

      // Récupérer les utilisateurs depuis localStorage
      const users = JSON.parse(localStorage.getItem("users")) || [];

      // Rechercher l'utilisateur correspondant
      const user = users.find(
        (u) => u.email === email.value && u.password === password.value
      );

      if (user) {
        alert("Connexion réussie !");
        authStore.login(user); // Stocker les infos utilisateur dans Pinia

        // Redirection selon les rôles
        if (authStore.isManager()) {
          // Si le rôle est "Manager", redirige vers la gestion des projets
            router.push("/dashboard");
        } else {
          // Sinon, redirige vers le tableau de bord
            router.push("/dashboard");
        }
      } else {
        alert("Nom d'utilisateur ou mot de passe incorrect !");
      }
    };

    const goToRegister = () => {
       router.push("/register");
    };

    return {
      email,
      password,
      handleLogin,
      goToRegister,
    };
  },
};
</script>

<style scoped>
/* Style inchangé */
</style>
