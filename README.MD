### Installation des modules
> npm install

### Configurer la connexion à la base de donnée en ligne:
1. Copier le fichier **.env.example** et renommer le fichier copié en **.env**
2. Remplacer le contenu de la variable d'environnement **db_url** avec celui fournis de la base de donnée
3. Ne pas push l'adresse de la base de donnée dans le fichier **.env.example** 😅
4. Les informations de la base de donnée sont dans le fichier config/database.js.

### Migration
1. Copier le fichier **back/migrations/migrate-mongo-config-example.js** et renommer le fichier copié en **back/migrations/migrate-mongo-config.js**
2. Remplacer le contenu des paramètres **url** et **databaseName** avec celui fournis de la base de donnée
3. Ne pas push l'adresse de la base de donnée dans le fichier **back/migrations/migrate-mongo-config-example.js** 😅

Exécuter toutes les migrations de base de données non appliquées
> migrate-mongo up

Annuler la dernière migration de base de données appliquées
> migrate-mongo down

Aficher le journal des modifications de la base de données
> migrate-mongo status

### Pour windows seulement
Dans le fichier packages.json 
ajouter "SET " dans le script dev
exemple:
> "dev": "SET NODE_ENV=development && nodemon ./bin/www"

### Lancer le serveur
**Environnement de developpement**
> npm run dev

**Environnement de production**
> npm run prod

### Documentation
Pour générer la documentation
> npm run doc

Pour consulter la documentation : **/docs/index.html**

Vous avez la possibilité de voir l'ancien projet sur la deuxième branche. De plus vous pouvez retrouver tous les documents du projets dans le dossier "Ressources".