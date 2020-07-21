# simplon_vote BACK

### Initialisation du projet BACK
Se placer dans le répertoire 'back'
> cd /simplon_vote/back

### Installer des modules
> npm install

### Configurer la connexion à la base de donnée en ligne:
1. Copier le fichier **.env.example** et renommer le fichier copié en **.env**
2. Remplacer le contenu de la variable d'environnement **db_url** avec celui fournis de la base de donnée
3. Ne pas push l'adresse de la base de donnée dans le fichier **.env.example** 😅
4. Les informations de la base de donnée sont dans le fichier config/database.js.

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

Pour consulter la documentation : **back/docs/index.html**
