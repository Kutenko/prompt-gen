# prompt-gen

Генератор промптов для фото.

## 🚀 Деплой на GitHub Pages

Проект настроен на автоматический деплой через **GitHub Actions** — при пуше в ветку `main` сайт собирается и публикуется на GitHub Pages.

### Что уже настроено

- [`vite.config.js`](vite.config.js) — сборка с относительными путями (`base: "./"`), работает в подкаталоге `https://<user>.github.io/<repo>/`
- [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) — CI/CD: сборка → публикация через `actions/deploy-pages`
- [`package.json`](package.json) — скрипты `build`, `predeploy`, `deploy`

### Как развернуть (один раз)

1. Создайте репозиторий на GitHub (например, `prompt-gen`) и запушьте туда этот проект (ветка `main`).
2. В репозитории откройте **Settings → Pages**.
3. В блоке **Build and deployment** выберите **Source: GitHub Actions**.
4. После первого пуша workflow запустится автоматически. Сайт будет доступен по адресу:
   `https://<ваш-username>.github.io/prompt-gen/`

### Альтернативный ручной деплой

Если не хотите использовать GitHub Actions:

```bash
npm install -g gh-pages
npm run deploy
```

### Локальная разработка

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production-сборка в dist/
