# Plano: reorganizar o histórico de commits do GoBarber

## Diagnóstico

Hoje o repositório `Rocketseat-GoBarber` tem só **12 commits**, e a
esmagadora maioria do código entrou de uma vez só:

```
d45a0b7 first commit                          (1 arquivo)
3e2efc1 add client and server                 (184 arquivos!)
ac90db1 feat: add md
8200c17 Update README.md
ee6fb6b fix: redis conection
3b9502a fix: mongo db version docker-compose
f8d7de3 fix: mongo db connection
42fae51 feat: api routes
4f27107 fix: remove client.http
7f31101 refactor: remove react query
7aae060 fix: ajustado server.ts
f6ad48b Merge pull request #1 from Junior580/fix-server
```

Ou seja: não existe um histórico granular "de verdade" para reorganizar
(reordenar/squashar) — o commit `3e2efc1` já jogou o client e o server
inteiros de uma vez. Por isso a única forma de ter um histórico que
"conta a história" do projeto é **reconstruir os commits do zero**,
recriando a evolução lógica do código (não a ordem cronológica real,
que nunca existiu commit a commit).

Isso é uma prática comum e aceita para "arrumar a casa" antes de usar
um repo como portfólio — não é enganar ninguém, é reorganizar a
apresentação do trabalho que você já fez.

## Estratégia

1. Criar uma branch nova, sem histórico (`--orphan`), a partir do
   mesmo código que já está no `main` hoje.
2. Reconstruir o projeto em **22 commits atômicos**, cada um com um
   propósito único, seguindo **Conventional Commits** em inglês
   (`feat`, `fix`, `chore`, `docs`, `ci`), na ordem em que um
   desenvolvedor backend→frontend normalmente constrói esse tipo de
   projeto (setup → config → domínio de usuários → autenticação →
   upload de avatar → recuperação de senha → agendamentos →
   notificações → infra HTTP → docker/CI → frontend → páginas).
3. No final, **conferir automaticamente** que o código resultante é
   byte-a-byte idêntico ao que está no `main` atual (nenhuma
   funcionalidade muda, só a história de como ela foi construída).
4. Guardar o histórico atual com segurança, em uma branch e uma tag de
   backup, **local e no GitHub**, antes de qualquer coisa destrutiva.
5. Só depois disso, trocar o `main` e enviar com
   `git push --force-with-lease` (mais seguro que `--force` puro: ele
   recusa o push se alguém mudou o remoto desde a última vez que você
   olhou).

## Sequência de commits que o script vai criar

1. `docs: add project overview`
2. `chore(server): scaffold project structure and tooling`
3. `feat(config): add environment configuration`
4. `feat(users): add user model and repositories`
5. `feat(users): add user crud services`
6. `feat(auth): add jwt authentication`
7. `feat(users): add avatar upload`
8. `feat(users): add forgot and reset password flow`
9. `feat(cache): add redis cache provider`
10. `feat(appointments): add appointment scheduling services`
11. `feat(notifications): add appointment notifications`
12. `feat(http): set up express server and routes`
13. `chore(server): add docker and deployment config`
14. `ci: add test coverage workflow`
15. `chore(client): scaffold frontend project`
16. `feat(ui): add base ui components`
17. `feat(client): add auth context and api service`
18. `feat(auth): add sign in and sign up pages`
19. `feat(auth): add forgot and reset password pages`
20. `feat(dashboard): add provider dashboard page`
21. `feat(profile): add user profile page`
22. `feat(routes): add private routes and app entry`

(+ um commit final de segurança, `chore: add remaining project files`,
que só entra em ação se sobrar algum arquivo que eu não tenha mapeado —
o ideal é que ele fique vazio e nem apareça.)

## Pontos importantes antes de rodar

- **O repositório já está no GitHub.** Isso significa que, depois do
  push forçado, qualquer clone/fork antigo vai ficar "desalinhado" com
  o novo `main`. Para um projeto pessoal de portfólio isso raramente é
  um problema, mas vale confirmar que ninguém mais depende desse
  histórico.
- **Nada de comportamento do app muda.** É só a forma como o código
  chegou ao estado atual que muda — o script confere isso
  automaticamente antes de deixar você prosseguir.
- **Os commits intermediários não necessariamente compilam sozinhos.**
  Como o código já existia pronto e eu só estou "fatiando" ele por
  assunto, um commit no meio da sequência pode referenciar algo que só
  aparece formalmente em um commit seguinte. Isso é normal em
  históricos reconstruídos e não afeta o resultado final.
- **Nada é enviado ao GitHub sem sua confirmação.** O script pausa,
  mostra o novo `git log` e só faz o push depois que você digitar
  "sim".
- **Existe uma rede de segurança dupla:** a branch/tag de backup (local
  e remota) com o histórico original, e a checagem de que a árvore
  final bate exatamente com o `main` atual antes de qualquer push.

## Como rodar

```bash
cd ~/Documents/rocktseat/Rocketseat-GoBarber
chmod +x rewrite-history.sh
./rewrite-history.sh
```

O script vai:
1. Checar se não há mudanças pendentes.
2. Criar e subir o backup (`backup/original-history` e uma tag
   `backup/original-<data>`).
3. Criar a branch `rewrite-main` e fazer os 22 commits.
4. Comparar o resultado com o `main` original.
5. Perguntar se pode trocar o `main` e fazer o push forçado.

## Se algo der errado / quiser voltar atrás

O histórico antigo nunca é apagado. Para voltar exatamente ao que
estava antes:

```bash
git checkout main
git reset --hard backup/original-history
git push origin main --force-with-lease
```

## Para os próximos commits (daqui pra frente)

Agora que o histórico está organizado, vale manter o padrão:

- Um commit por mudança lógica (não misture `feat` com `fix` não
  relacionado no mesmo commit).
- Mensagens no padrão `tipo(escopo): descrição curta no imperativo`
  (`feat(users): add phone field to profile`, não
  `feat(users): added phone field to profile` nem
  `Adicionei campo de telefone`).
- Tipos mais comuns: `feat`, `fix`, `refactor`, `docs`, `test`,
  `chore`, `ci`, `style`, `perf`.
- Antes de dar `git push`, dá pra revisar com `git log --oneline -5`
  se a sequência de commits está contando uma história que faz
  sentido.
