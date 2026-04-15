# /project:setup-git

Inizializza il repository Git e collega a GitHub.

## Protocollo

### 1. Verifica stato attuale
```bash
git status 2>&1 || echo "Git non inizializzato"
```

### 2. Se Git non è inizializzato
```bash
git init
```

### 3. Configurare .gitignore

Verificare che `.gitignore` contenga almeno:
```
# Dependencies
node_modules/

# Build output
build/

# Environment / secrets
.env
.env.local
.env.production

# Claude Code personal files
CLAUDE.local.md
.claude/settings.local.json

# IDE
.idea/
.vscode/
*.swp

# OS
.DS_Store
Thumbs.db

# Firebase
.firebase/
.firebaserc

# DNS backup
dns-backup-*.csv
```

### 4. Primo commit
```bash
git add .
git commit -m "Initial commit: my-wedding-day project setup"
```

### 5. Collegare a GitHub (istruzioni manuali)

```bash
# Creare un nuovo repository su github.com (vuoto, senza README)
# Poi collegare:
git remote add origin https://github.com/<username>/my-wedding-day.git
git branch -M main
git push -u origin main
```

> ⚠️ Claude NON esegue `git push` autonomamente. Il push è sempre manuale.

### 6. Checklist
```
### ✅ Git setup
- [ ] .gitignore configurato correttamente
- [ ] Nessun file sensibile (credenziali Firebase, .env) nel repo
- [ ] CLAUDE.local.md e settings.local.json esclusi
- [ ] Remote origin configurato
- [ ] Branch main come default
```
