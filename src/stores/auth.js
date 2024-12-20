import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authenticatedUser: null, 
    userRoles: [], 
  }),
  actions: {
    login(user) {
      this.authenticatedUser = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      this.userRoles = user.roles;

      // Optionnel : sauvegarder les données dans le localStorage si nécessaire
      localStorage.setItem("authenticatedUser", JSON.stringify(this.authenticatedUser));
      localStorage.setItem("userRoles", JSON.stringify(this.userRoles));
    },
    logout() {
      this.authenticatedUser = null;
      this.userRoles = [];
      localStorage.removeItem("authenticatedUser");
      localStorage.removeItem("userRoles");
    },
    isManager() {
      return this.userRoles.includes("Manager");
    },
  },
});
