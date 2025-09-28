// utils/ErrorHandler.js

export class ErrorHandler {
  static getMessage(error) {

    
    if (!error) return "Erreur inconnue.";
    
    if (error.response) {
      return this.handleHttpError(error.response);
    }
    
    if (error.request) {
      return "Impossible de joindre le serveur. Vérifiez votre connexion internet.";
    }
    console.log('cccccccccccccc');
    console.log(error.response);
    console.log(error.response);

    
    return error.message || "Une erreur est survenue.";
  }

  static handleHttpError(response) {
    const { status, data } = response;
    const backendMessage = data?.message;

    switch (status) {
      case 400: return backendMessage || "Information invalide. Vérifiez vos informations.";
      case 401: return "Email ou mot de passe incorrect.";
      case 403: return "Vous n’avez pas la permission.";
      case 404: return "Ressource introuvable.";
      case 409: return "Conflit de données (ex : email déjà utilisé).";
      case 500: return "Erreur serveur. Veuillez réessayer plus tard.";
      default: return backendMessage || "Une erreur inconnue est survenue.";
    }
  }
}
