#!/usr/bin/env bash
#
# rewrite-history.sh
#
# Reconstrói o histórico de commits do GoBarber em uma sequência
# organizada, atômica e em Conventional Commits (inglês), preservando
# EXATAMENTE o estado final do código (a árvore final é idêntica à do
# main atual).
#
# NÃO reescreve a linha do tempo real do curso — ela nunca existiu de
# forma granular (o projeto inteiro foi commitado de uma vez em
# "add client and server"). O que este script faz é recontar a
# história de um jeito que mostra organização e conhecimento de git,
# como normalmente se faz ao "limpar" um repositório de portfólio.
#
# SEGURANÇA:
#   - cria uma branch de backup (backup/original-history) e uma tag
#     (backup/original-<data>) apontando pro estado atual, e sobe as
#     duas pro GitHub antes de qualquer coisa destrutiva.
#   - só troca a branch main de verdade depois de comparar a árvore
#     final da branch reescrita com a árvore final da branch original
#     e confirmar que são idênticas.
#   - o push forçado só acontece depois de você confirmar no prompt.
#
# Rode este script na raiz do repositório:
#   cd /home/junior/Documents/rocktseat/Rocketseat-GoBarber
#   chmod +x rewrite-history.sh
#   ./rewrite-history.sh
#
set -uo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "$REPO_ROOT" ]; then
  echo "Erro: rode este script de dentro do repositório git." >&2
  exit 1
fi
cd "$REPO_ROOT"

if [ -n "$(git status --porcelain)" ]; then
  echo "Erro: existem mudanças não commitadas. Faça commit ou stash antes de continuar." >&2
  git status --short
  exit 1
fi

ORIGINAL_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
ORIGINAL_HEAD="$(git rev-parse HEAD)"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_BRANCH="backup/original-history"
BACKUP_TAG="backup/original-${STAMP}"

echo "== Branch atual: $ORIGINAL_BRANCH ($ORIGINAL_HEAD) =="

# --- 1. Backup local e remoto -------------------------------------------
echo "== Criando backup local (branch + tag) =="
git branch -f "$BACKUP_BRANCH" "$ORIGINAL_HEAD"
git tag -f "$BACKUP_TAG" "$ORIGINAL_HEAD"

echo "== Enviando backup para o GitHub (origin) =="
git push origin "$BACKUP_BRANCH":"$BACKUP_BRANCH"
git push origin "refs/tags/${BACKUP_TAG}":"refs/tags/${BACKUP_TAG}"

# --- helper ---------------------------------------------------------------
# add PATH...   -> adiciona cada caminho se ele existir; avisa se não existir
add() {
  for p in "$@"; do
    if [ -e "$p" ]; then
      git add -- "$p"
    else
      echo "  (aviso: caminho não encontrado, pulando: $p)"
    fi
  done
}

# commit "mensagem"  -> só commita se houver algo staged
commit() {
  if git diff --cached --quiet; then
    echo "  (nada para commitar em: $1 — pulando)"
  else
    git commit -q -m "$1"
    echo "  -> commit criado: $1"
  fi
}

# --- 2. Nova branch órfã (sem histórico) ---------------------------------
echo "== Criando branch órfã rewrite-main =="
git checkout --orphan rewrite-main
git rm -rf --cached . >/dev/null

# --- 3. Sequência de commits atômicos ------------------------------------

echo "-- docs: add project overview"
add README.md
commit "docs: add project overview"

echo "-- chore(server): scaffold project structure and tooling"
add \
  server/.editorconfig \
  server/.env.example \
  server/.env.development \
  server/.env.production \
  server/.eslintignore \
  server/.eslintrc.json \
  server/.gitignore \
  server/.lintstagedrc.json \
  server/.prettierrc.json \
  server/.swcrc \
  server/.husky \
  server/package.json \
  server/yarn.lock \
  server/tsconfig.json \
  server/jest.config.ts \
  server/LICENCE \
  server/README.md \
  server/tmp/.gitkeep \
  server/src/@types/express.d.ts
commit "chore(server): scaffold project structure and tooling"

echo "-- feat(config): add environment configuration"
add \
  server/src/config/auth.ts \
  server/src/config/cache.ts \
  server/src/config/mail.ts \
  server/src/config/upload.ts
commit "feat(config): add environment configuration"

echo "-- feat(users): add user model and repositories"
add \
  server/src/modules/users/dtos \
  server/src/modules/users/infra/typeorm/entities/Users.ts \
  server/src/modules/users/infra/typeorm/repositories/UsersRepository.ts \
  server/src/modules/users/repositories/interfaces/IUserRepository.ts \
  server/src/modules/users/repositories/inMemory/InMemoryUserRepository.ts \
  server/src/modules/users/providers
commit "feat(users): add user model and repositories"

echo "-- feat(users): add user crud services"
add \
  server/src/modules/users/services/CreateUserService.ts \
  server/src/modules/users/services/CreateUserService.spec.ts \
  server/src/modules/users/services/UpdateProfileService.ts \
  server/src/modules/users/services/UpdateProfileService.spec.ts \
  server/src/modules/users/services/DeleteUserService.ts \
  server/src/modules/users/services/DeleteUserService.spec.ts \
  server/src/modules/users/services/ShowProfileService.ts \
  server/src/modules/users/services/ShowProfileService.spec.ts \
  server/src/modules/users/infra/http/controllers/CreateUserController.ts \
  server/src/modules/users/infra/http/controllers/UpdateProfileController.ts \
  server/src/modules/users/infra/http/controllers/DeleteUserController.ts \
  server/src/modules/users/infra/http/controllers/ShowProfileController.ts \
  server/src/modules/users/infra/http/routes/users.routes.ts \
  server/src/modules/users/infra/http/routes/profile.routes.ts
commit "feat(users): add user crud services"

echo "-- feat(auth): add jwt authentication"
add \
  server/src/modules/users/services/AuthenticateUserService.ts \
  server/src/modules/users/services/AuthenticateUserService.spec.ts \
  server/src/modules/users/infra/http/controllers/SessionsController.ts \
  server/src/modules/users/infra/http/routes/sessions.routes.ts \
  server/src/modules/users/infra/http/middlewares/ensureAuthenticated.ts
commit "feat(auth): add jwt authentication"

echo "-- feat(users): add avatar upload"
add \
  server/src/modules/users/services/UpdateUserAvatarService.ts \
  server/src/modules/users/services/UpdateUserAvatarService.spec.ts \
  server/src/modules/users/infra/http/controllers/UserAvatarController.ts \
  server/src/shared/container/providers/StorageProvider
commit "feat(users): add avatar upload"

echo "-- feat(users): add forgot and reset password flow"
add \
  server/src/modules/users/services/SendForgotPasswordEmailService.ts \
  server/src/modules/users/services/SendForgotPasswordEmailService.spec.ts \
  server/src/modules/users/services/ResetPasswordService.ts \
  server/src/modules/users/services/ResetPasswordService.spec.ts \
  server/src/modules/users/infra/http/controllers/ForgotPasswordController.ts \
  server/src/modules/users/infra/http/controllers/ResetPasswordController.ts \
  server/src/modules/users/infra/http/routes/password.routes.ts \
  server/src/modules/users/views/forgot_password.hbs \
  server/src/modules/users/infra/typeorm/entities/UserToken.ts \
  server/src/modules/users/infra/typeorm/repositories/UserTokensRepository.ts \
  server/src/modules/users/repositories/interfaces/IUserTokensRepository.ts \
  server/src/modules/users/repositories/inMemory/InMemoryUserTokensRepository.ts \
  server/src/shared/container/providers/MailProvider \
  server/src/shared/container/providers/MailTemplateProvider
commit "feat(users): add forgot and reset password flow"

echo "-- feat(cache): add redis cache provider"
add server/src/shared/container/providers/CacheProvider
commit "feat(cache): add redis cache provider"

echo "-- feat(appointments): add appointment scheduling services"
add server/src/modules/appointments
commit "feat(appointments): add appointment scheduling services"

echo "-- feat(notifications): add appointment notifications"
add server/src/modules/notifications
commit "feat(notifications): add appointment notifications"

echo "-- feat(http): set up express server and routes"
add \
  server/src/shared/infra/http/server.ts \
  server/src/shared/infra/http/middlewares/handleError.ts \
  server/src/shared/infra/http/middlewares/rateLimiter.ts \
  server/src/shared/infra/http/routes/index.routes.ts \
  server/src/shared/container/index.ts \
  server/src/shared/errors/AppError.ts \
  server/src/shared/infra/typeorm/data-source.ts \
  server/src/shared/infra/typeorm/data-source-mongo.ts \
  server/src/shared/infra/typeorm/migrations
commit "feat(http): set up express server and routes"

echo "-- chore(server): add docker and deployment config"
add \
  server/Dockerfile \
  server/docker-compose.yml \
  server/entrypoint.sh \
  server/nginx.conf \
  server/api_routes_backup.json
commit "chore(server): add docker and deployment config"

echo "-- ci: add test coverage workflow"
add server/.github
commit "ci: add test coverage workflow"

echo "-- chore(client): scaffold frontend project"
add \
  client/.editorconfig \
  client/.env.example \
  client/.eslintignore \
  client/.eslintrc.json \
  client/.gitignore \
  client/index.html \
  client/package.json \
  client/pnpm-lock.yaml \
  client/README.md \
  client/tsconfig.json \
  client/tsconfig.node.json \
  client/vite.config.ts \
  client/src/vite-env.d.ts
commit "chore(client): scaffold frontend project"

echo "-- feat(ui): add base ui components"
add \
  client/src/components \
  client/src/styles \
  client/src/assets
commit "feat(ui): add base ui components"

echo "-- feat(client): add auth context and api service"
add \
  client/src/hooks \
  client/src/services \
  client/src/main.tsx
commit "feat(client): add auth context and api service"

echo "-- feat(auth): add sign in and sign up pages"
add \
  client/src/pages/Home/SignIn \
  client/src/pages/Home/SignUp
commit "feat(auth): add sign in and sign up pages"

echo "-- feat(auth): add forgot and reset password pages"
add \
  client/src/pages/Home/ForgotPassword \
  client/src/pages/Home/ResetPassword
commit "feat(auth): add forgot and reset password pages"

echo "-- feat(dashboard): add provider dashboard page"
add client/src/pages/Admin/Dashboard
commit "feat(dashboard): add provider dashboard page"

echo "-- feat(profile): add user profile page"
add client/src/pages/Admin/Profile
commit "feat(profile): add user profile page"

echo "-- feat(routes): add private routes and app entry"
add \
  client/src/routes/PrivateRoute.tsx \
  client/src/pages/App/App.tsx
commit "feat(routes): add private routes and app entry"

echo "-- rede de segurança: qualquer arquivo esquecido entra aqui"
git add -A
commit "chore: add remaining project files"

# --- 4. Verificação --------------------------------------------------------
echo "== Comparando árvore final da nova história com o main original =="
if git diff --quiet "$ORIGINAL_HEAD" rewrite-main; then
  echo "OK: o código final é idêntico ao main original. Nada de conteúdo mudou."
else
  echo "ATENÇÃO: há diferenças entre o resultado e o main original:" >&2
  git diff --stat "$ORIGINAL_HEAD" rewrite-main
  echo "Não vou trocar a branch main nem fazer push. Investigue antes de continuar." >&2
  exit 1
fi

echo
echo "Novo histórico (rewrite-main):"
git log --oneline rewrite-main

# --- 5. Troca da branch e push forçado (com confirmação) -------------------
echo
read -r -p "Confira o log acima. Digite 'sim' para substituir a main e enviar (push --force-with-lease) para o GitHub: " CONFIRM
if [ "$CONFIRM" != "sim" ]; then
  echo "Cancelado. A branch 'rewrite-main' e o backup '$BACKUP_BRANCH'/'$BACKUP_TAG' continuam disponíveis para você revisar."
  exit 0
fi

git branch -M rewrite-main main
git push origin main --force-with-lease

echo
echo "Pronto. A main no GitHub agora tem o histórico reorganizado."
echo "O histórico original ficou salvo em:"
echo "  - branch local/remota: $BACKUP_BRANCH"
echo "  - tag local/remota:    $BACKUP_TAG"
