#!/bin/bash

# Script de déploiement automatisé pour l'application Gestion des Salaires
# Usage: ./deploy.sh [environment] [version]

set -e  # Exit on any error

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="gestion-salaires-frontend"
DOCKER_REGISTRY="your-registry.com"  # Remplacer par votre registry
ENVIRONMENTS=("development" "staging" "production")

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions utilitaires
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier les prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."
    
    # Vérifier Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker n'est pas installé"
        exit 1
    fi
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js n'est pas installé"
        exit 1
    fi
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        log_error "npm n'est pas installé"
        exit 1
    fi
    
    log_success "Tous les prérequis sont satisfaits"
}

# Valider l'environnement
validate_environment() {
    local env=$1
    if [[ ! " ${ENVIRONMENTS[@]} " =~ " ${env} " ]]; then
        log_error "Environnement invalide: $env"
        log_info "Environnements disponibles: ${ENVIRONMENTS[*]}"
        exit 1
    fi
}

# Installer les dépendances
install_dependencies() {
    log_info "Installation des dépendances..."
    npm ci --silent
    log_success "Dépendances installées"
}

# Lancer les tests de qualité
run_quality_checks() {
    log_info "Exécution des vérifications de qualité..."
    
    # Linting
    log_info "Vérification du code avec ESLint..."
    npm run lint:check
    
    # Type checking (si TypeScript)
    if [ -f "tsconfig.json" ]; then
        log_info "Vérification des types..."
        npm run type-check
    fi
    
    log_success "Vérifications de qualité terminées"
}

# Build de l'application
build_application() {
    local env=$1
    local version=$2
    
    log_info "Build de l'application pour l'environnement: $env"
    
    # Définir les variables d'environnement
    export NODE_ENV=production
    export VITE_APP_VERSION=$version
    export VITE_APP_ENVIRONMENT=$env
    
    # Charger les variables d'environnement spécifiques
    if [ -f ".env.$env" ]; then
        log_info "Chargement des variables d'environnement depuis .env.$env"
        set -a
        source ".env.$env"
        set +a
    fi
    
    # Build
    npm run build:production
    
    log_success "Build terminé"
}

# Build de l'image Docker
build_docker_image() {
    local env=$1
    local version=$2
    local image_tag="$DOCKER_REGISTRY/$PROJECT_NAME:$version"
    local latest_tag="$DOCKER_REGISTRY/$PROJECT_NAME:latest-$env"
    
    log_info "Construction de l'image Docker: $image_tag"
    
    # Build args
    local build_args=""
    if [ -f ".env.$env" ]; then
        while IFS= read -r line; do
            if [[ $line =~ ^VITE_ ]]; then
                build_args="$build_args --build-arg $line"
            fi
        done < ".env.$env"
    fi
    
    # Build de l'image
    docker build \
        -f Dockerfile.production \
        -t "$image_tag" \
        -t "$latest_tag" \
        $build_args \
        .
    
    log_success "Image Docker construite: $image_tag"
}

# Pousser l'image vers le registry
push_docker_image() {
    local env=$1
    local version=$2
    local image_tag="$DOCKER_REGISTRY/$PROJECT_NAME:$version"
    local latest_tag="$DOCKER_REGISTRY/$PROJECT_NAME:latest-$env"
    
    log_info "Push de l'image vers le registry..."
    
    docker push "$image_tag"
    docker push "$latest_tag"
    
    log_success "Image poussée vers le registry"
}

# Déployer vers l'environnement
deploy_to_environment() {
    local env=$1
    local version=$2
    
    log_info "Déploiement vers l'environnement: $env"
    
    case $env in
        "development")
            deploy_to_development "$version"
            ;;
        "staging")
            deploy_to_staging "$version"
            ;;
        "production")
            deploy_to_production "$version"
            ;;
    esac
    
    log_success "Déploiement terminé"
}

# Déploiement vers le développement
deploy_to_development() {
    local version=$1
    log_info "Déploiement en développement avec docker-compose..."
    
    # Utiliser docker-compose pour le développement
    export IMAGE_TAG="$DOCKER_REGISTRY/$PROJECT_NAME:$version"
    docker-compose -f docker-compose.dev.yml up -d
}

# Déploiement vers le staging
deploy_to_staging() {
    local version=$1
    log_info "Déploiement en staging..."
    
    # Ici vous pouvez ajouter votre logique de déploiement staging
    # Par exemple: kubectl, helm, etc.
    log_warning "Logique de déploiement staging à implémenter"
}

# Déploiement vers la production
deploy_to_production() {
    local version=$1
    log_info "Déploiement en production..."
    
    # Confirmation pour la production
    read -p "Êtes-vous sûr de vouloir déployer en production? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_warning "Déploiement annulé"
        exit 0
    fi
    
    # Ici vous pouvez ajouter votre logique de déploiement production
    # Par exemple: kubectl, helm, etc.
    log_warning "Logique de déploiement production à implémenter"
}

# Nettoyage
cleanup() {
    log_info "Nettoyage..."
    
    # Nettoyer les images Docker locales anciennes
    docker image prune -f
    
    log_success "Nettoyage terminé"
}

# Fonction principale
main() {
    local env=${1:-"development"}
    local version=${2:-"$(date +%Y%m%d-%H%M%S)"}
    
    log_info "Début du déploiement"
    log_info "Environnement: $env"
    log_info "Version: $version"
    
    # Validation
    validate_environment "$env"
    check_prerequisites
    
    # Étapes de déploiement
    install_dependencies
    run_quality_checks
    build_application "$env" "$version"
    build_docker_image "$env" "$version"
    
    # Push et déploiement seulement si pas en local
    if [ "$env" != "development" ]; then
        push_docker_image "$env" "$version"
    fi
    
    deploy_to_environment "$env" "$version"
    cleanup
    
    log_success "Déploiement terminé avec succès!"
    log_info "Version déployée: $version"
    log_info "Environnement: $env"
}

# Gestion des arguments
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Usage: $0 [environment] [version]"
    echo ""
    echo "Arguments:"
    echo "  environment    Environnement cible (development|staging|production)"
    echo "  version        Version à déployer (par défaut: timestamp)"
    echo ""
    echo "Exemples:"
    echo "  $0                           # Déploie en development avec timestamp"
    echo "  $0 staging                   # Déploie en staging avec timestamp"
    echo "  $0 production v1.2.3        # Déploie en production avec version v1.2.3"
    exit 0
fi

# Exécuter le script principal
main "$@"