# AI Interaction Log - Task Manager

# AI Interaction 1 - Налаштування пакетів, форматера та лінтера

## Мета взаємодії

Налаштувати базове середовище розробки Task Manager на Node.js + Express: встановити необхідні залежності, форматер і лінтер, підготувати скрипти та структуру проєкту.

## Prompt

Тепер давай перейдемо до практичної частини і підкажи як мені налаштувати пакети, встановити форматер і лінтер?

## AI Response

## Налаштування проєкту: пакети, Prettier і ESLint

Команди нижче розраховані на Express + JavaScript. Я не вказую версії: `npm install` поставить актуальні. Якщо щось не збігається з інструкцією, звіряйтеся з документацією ESLint і Prettier, бо їхні налаштування змінювалися між версіями.

### 1. Передумови

- Node.js (LTS-версія), перевірка: `node -v`
- Git, перевірка: `git --version`

### 2. Ініціалізація

bash

```bash
mkdir task-manager && cd task-manager
git init
npm init -y
```

У `package.json` додайте `"type": "module"`, щоб використовувати сучасний `import/export` замість `require`:

json

```json
{
  "name": "task-manager",
  "version": "1.0.0",
  "type": "module"
}
```

Якщо в курсі використовують `require` (CommonJS), цей рядок не додавайте, але тоді змініть `sourceType` в конфігу ESLint на `commonjs`.

### 3. Пакети

**Основні (runtime):**

bash

```bash
npm install express pg dotenv
```

**Інструменти розробки:**

bash

```bash
npm install --save-dev eslint @eslint/js globals prettier eslint-config-prettier
```

Що для чого:

| Пакет                    | Призначення                                                                    |
| ------------------------ | ------------------------------------------------------------------------------ |
| `eslint`, `@eslint/js`   | Лінтер і його рекомендовані правила                                            |
| `globals`                | Список глобальних змінних Node.js (`process`, `console`), щоб ESLint не лаявся |
| `prettier`               | Форматер                                                                       |
| `eslint-config-prettier` | Вимикає правила ESLint, які конфліктують із Prettier                           |

Тести окремо ставити не потрібно: у Node є вбудований `node:test`. Пакети для сесій, паролів і безпеки (`express-session`, `connect-pg-simple`, `argon2`, `helmet`, `express-rate-limit`) ставте пізніше, коли дійдете до модуля `auth`.

### 4. Конфігурація ESLint

Створіть `eslint.config.js` у корені (сучасний «flat» формат):

js

```js
const js = require('@eslint/js');
const globals = require('globals');
const prettier = require('eslint-config-prettier');

module.exports = [
  js.configs.recommended,
  prettier,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
    rules: {
      'no-unused-vars': 'error',
      eqeqeq: 'error',
      'no-console': 'warn',
    },
  },
  { ignores: ['node_modules/', 'coverage/', 'dist/'] },
];
```

### 5. Конфігурація Prettier

`.prettierrc.json`:

```json
{
  "singleQuote": true,
  "semi": true,
  "printWidth": 100,
  "endOfLine": "lf"
}
```

`.prettierignore`:

```
node_modules
coverage
dist
package-lock.json
```

Стиль (крапки з комою, лапки) оберіть будь-який, головне єдиний для всього проєкту.

### 6. Скрипти в package.json

json

```json
"scripts": {
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "lint": "eslint .",
  "test": "node --test tests/",
  "build": "node --check src/index.js",
  "check": "npm run format:check && npm run lint && npm run test && npm run build"
}
```

Запуск:

bash

```bash
npm run lint
npm run format
npm run dev
```

### 7. Допоміжні файли

`.gitignore`:

```
node_modules
.env
coverage
```

`.env.example` (його комітять, а `.env` ні):

```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/taskmanager
SESSION_SECRET=change-me
```

### 8. Налаштування редактора (VS Code)

Встановіть розширення **ESLint** і **Prettier - Code formatter**, потім створіть `.vscode/settings.json`:

json

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

Тепер при збереженні файл форматується Prettier, а прості помилки ESLint виправляються автоматично.

### 9. Стартова структура

```
task-manager/
├── src/
│   ├── server.js
│   ├── app.js
│   ├── shared/
│   ├── auth/
│   └── tasks/
├── docs/
│   └── adr/
├── eslint.config.js
├── .prettierrc.json
├── .prettierignore
├── .gitignore
├── .env.example
└── package.json
```

Це відповідає межам модулів із попередніх обговорень (`auth`, `tasks`, `shared`).

### 10. Перевірка, що все працює

1. Створіть `src/server.js` із будь-яким рядком, наприклад `const a = 1` без використання.
2. Запустіть `npm run lint` і переконайтеся, що ESLint скаржиться на невикористану змінну.
3. Зіпсуйте відступи й запустіть `npm run format`, щоб побачити, як Prettier виправляє файл.
4. Приберіть тестовий код.

### 11. Що додати пізніше

- **Перевірка меж модулів:** `eslint-plugin-boundaries` або `dependency-cruiser` для правила «зовні імпортується лише `index.js` модуля».
- **Pre-commit хуки** (`husky` + `lint-staged`), щоб лінт і форматування запускалися автоматично перед комітом.
- **CI** (GitHub Actions), що запускає `lint`, `format:check` і `test`.

Скажіть, коли будете готові, і я допоможу з мінімальним `app.js`/`server.js`, підключенням до PostgreSQL або налаштуванням `eslint-plugin-boundaries`. Промпти про код можете зберігати у `docs/ai-prompts/code-prompts.md`.

## My Feedback

- Корисне: послідовний план налаштування, поділ пакетів на runtime і dev, пояснення, навіщо окремо Prettier і ESLint.
- Погоджуюся: налаштувати форматер і лінтер на початку, щоб стиль був єдиним з першого коміту; використати вбудований `node:test` замість окремої бібліотеки.
- Перевірю: команди на моїй версії Node, перш ніж на них спиратися.

# AI Interaction 2 - Організація комітів і Pull Request

## Мета взаємодії

Організувати робочий процес Git так, щоб зміни розроблялися в окремих feature-гілках, коміти потрапляли саме в них, а готові зміни об’єднувалися з main через Pull Request.

## Prompt

Як мені реалізовувати коміти і як зробити PR, щоб коміти відразу потрапляли в гілку feature-branch?

## AI Response

## Коміти та Pull Request у feature-гілці

Є важливий нюанс: PR не змушує коміти потрапляти в гілку. Спочатку ви **створюєте гілку і комітите в неї**, а PR лише пропонує злити цю гілку в `main`. Тому правильний порядок: гілка → коміти → push → PR.

### 1. Одноразове налаштування

bash

```bash
git config --global user.name "Ваше Ім'я"
git config --global user.email "you@example.com"
git branch -M main
```

Якщо репозиторій ще не на GitHub, створіть порожній репозиторій там і підключіть:

bash

```bash
git remote add origin https://github.com/<ваш-логін>/task-manager.git
git add .
git commit -m "chore: initial project setup"
git push -u origin main
```

### 2. Робочий цикл для кожної фічі

**Крок 1. Оновіть `main` і створіть гілку** (завжди до початку роботи, а не після):

bash

```bash
git switch main
git pull
git switch -c feature/auth-register
```

Перевірка, що ви в потрібній гілці: `git branch --show-current`.

**Крок 2. Робіть невеликі коміти:**

bash

```bash
git status
git add src/auth/service.js src/auth/routes.js
git commit -m "feat(auth): add user registration endpoint"
```

Після `git switch -c` усі коміти автоматично потрапляють у `feature/auth-register`, а не в `main`.

**Крок 3. Відправте гілку на GitHub:**

bash

```bash
git push -u origin feature/auth-register
```

`-u` запам'ятовує зв'язок, тож далі достатньо `git push`.

**Крок 4. Створіть PR** на GitHub: після push з'явиться кнопка **Compare & pull request**. Вкажіть base: `main`, compare: `feature/auth-register`. Або через консоль, якщо встановлено GitHub CLI:

bash

```bash
gh pr create --base main --title "feat(auth): user registration" --body "Опис змін"
```

**Крок 5. Злиття і прибирання:**

bash

```bash
git switch main
git pull
git branch -d feature/auth-register
```

### 3. Якщо закомітили не в ту гілку

Якщо встигли зробити коміт у `main`, але ще не робили push:

bash

```bash
git switch -c feature/auth-register   # нова гілка з цими комітами
git switch main
git reset --hard origin/main          # повертає main до стану на GitHub
```

Увага: `reset --hard` видаляє незакомічені зміни в `main`. Виконуйте його лише коли коміт уже є в новій гілці (перевірте `git log feature/auth-register`).

Якщо ще не робили коміт, а лише змінили файли, достатньо `git switch -c feature/назва`: зміни підуть за вами.

### 4. Як писати коміти

Формат **Conventional Commits**: `тип(область): короткий опис`.

| Тип        | Коли                           |
| ---------- | ------------------------------ |
| `feat`     | Нова функціональність          |
| `fix`      | Виправлення помилки            |
| `docs`     | Документація, ADR              |
| `refactor` | Зміна коду без зміни поведінки |
| `test`     | Тести                          |
| `chore`    | Налаштування, залежності       |

Правила:

- Один коміт, одна логічна зміна (не "зроблено все").
- Опис в наказовому способі, до ~70 символів: `add`, `fix`, а не `added`, `fixed`.
- Перед комітом: `npm run lint` і `npm run format:check`.

### 5. Назви гілок

`feature/<що>`, `fix/<що>`, `docs/<що>`: наприклад `feature/tasks-crud`, `fix/login-error`, `docs/adr-0004`. Латиниця, дефіси, без пробілів.

### 6. Захист `main` (рекомендовано)

Щоб випадково не комітити в `main`, на GitHub: **Settings → Branches → Add branch protection rule** для `main`, увімкніть **Require a pull request before merging**. Тоді прямий push у `main` буде заблоковано. Для вчення це гарна звичка, навіть коли ви єдиний розробник. Точні назви пунктів меню можуть відрізнятися, бо інтерфейс GitHub змінюється.

### 7. Корисні команди

bash

```bash
git log --oneline --graph   # історія
git diff --staged           # що піде в коміт
git commit --amend          # виправити останній коміт (до push)
git restore <файл>          # скасувати зміни у файлі

```

## My Feedback

- Корисне: порядок «гілка, коміти, push, PR» і пояснення, що коміти потрапляють у поточну гілку, а PR лише пропонує злиття.
- Погоджуюся: окрема feature-гілка для роботи, дрібні коміти, формат Conventional Commits.
- Беру до уваги: перед комітом перевіряти гілку через git branch --show-current`; `git reset --hard використовувати обережно, бо він видаляє незбережені зміни.

# AI Interaction 3 - Налаштування Git Hooks для автоматичних перевірок

## Мета взаємодії

Розібратися з Git Hooks та налаштувати автоматичні перевірки перед commit і push: форматування Prettier, статичний аналіз ESLint, smoke-тест і build-перевірку.

## Prompt

Поясни мені, що таке Git Hooks і як реалізувати їх у моєму проєкті Task Manager (Node.js + Express).
Мені потрібно налаштувати автоматичні перевірки перед `commit` та `push`:

- форматування коду (Prettier);
- статичний аналіз коду (ESLint);
- мінімальний smoke-тест;
- перевірка збірки (build).

## AI Response

### Що таке Git Hooks

**Git hook** це скрипт, який Git автоматично запускає в певний момент роботи: перед комітом, перед push, після merge тощо. Якщо скрипт завершується з ненульовим кодом, Git **скасовує операцію**. Так працює «брудний коміт блокується».

Hooks лежать у `.git/hooks/`, але ця папка **не потрапляє в репозиторій**, тому самі hooks не передаються іншим розробникам. Цю проблему вирішує **husky**: він зберігає hooks у папці `.husky/` (яка комітиться) і при `npm install` налаштовує Git так, щоб він брав скрипти звідти.

Найважливіші hooks:

| Hook         | Коли спрацьовує              | Для чого                         |
| ------------ | ---------------------------- | -------------------------------- |
| `pre-commit` | Перед створенням коміту      | Швидкі перевірки: формат, лінтер |
| `pre-push`   | Перед відправкою на сервер   | Повніші перевірки: тести, збірка |
| `commit-msg` | Після написання повідомлення | Перевірка формату повідомлення   |

### Як це реалізовано у вашому проєкті

**1. Перевірки як npm-скрипти** (`package.json`):

json

```json
"scripts": {
  "format:check": "prettier --check .",
  "lint": "eslint .",
  "test": "node --test \"tests/**/*.test.js\"",
  "build": "node -e \"require('./src/index')\"",
  "check": "npm run format:check && npm run lint && npm run test && npm run build",
  "prepare": "husky"
}
```

Оператор `&&` зупиняє ланцюжок на першій помилці, тому брудний файл відсікається вже на форматуванні.

**2. Встановлення husky:**

bash

```bash
npm install --save-dev husky
npx husky init
```

Команда створює `.husky/pre-commit` і додає скрипт `prepare`, який активує hooks після кожного `npm install`.

**3. Вміст hooks.** Обидва файли містять один рядок:

`.husky/pre-commit`

sh

```sh
npm run check
```

`.husky/pre-push`

sh

```sh
npm run check
```

`husky init` за замовчуванням пише в `pre-commit` лише `npm test`, тому його обов'язково треба замінити.

**4. Обгортка `make`** (`Makefile`):

makefile

```makefile
check:
	npm run check
```

**5. Перевірка, що hook працює:**

powershell

```powershell
Set-Content -Path src/dirty.js -Value "var x = 1" -Encoding utf8
git add src/dirty.js
git commit -m "test: dirty commit"
```

Очікується `husky - pre-commit script failed (code 1)` і відсутність коміту. Потім приберіть файл:

powershell

```powershell
git restore --staged src/dirty.js
Remove-Item src/dirty.js
```

### Як це відповідає вашим чотирьом вимогам

| Вимога           | Інструмент             | Крок у `check` |
| ---------------- | ---------------------- | -------------- |
| Форматування     | Prettier               | `format:check` |
| Статичний аналіз | ESLint                 | `lint`         |
| Smoke-тест       | `node:test`            | `test`         |
| Збірка           | `require` усіх модулів | `build`        |

### Нюанси

- **Дублювання на commit і push.** Зараз обидва hooks запускають повний `check`. Коли перевірки стануть повільними, на `pre-commit` лишіть швидкі (формат, лінтер), а повний набір на `pre-push`. Це варто записати в `standards/checks.md` як осмислене рішення.
- **`--no-verify`** (`git commit --no-verify`) обходить hooks. Тому в DoD є пункт «hook не обходили», а серйозніший захист дає CI на сервері, який можна додати пізніше.
- **Hooks не встановляться без `npm install`.** Після `git clone` потрібно виконати `make setup` (або `npm install`), інакше скрипт `prepare` не спрацює.
- **Windows.** Husky v9 працює в PowerShell і Git Bash. Файли hooks мають закінчуватися переносом рядка в стилі LF (його забезпечує ваш `.gitattributes`).

## My Feedback

- Корисне: пояснення, що таке hook і чому потрібен husky, поділ на pre-commit і pre-push, таблиця відповідності вимог і кроків `check`.
- Погоджуюся: єдиний скрипт npm run check для обох hook-ів і запуск через make.
- Сумніваюся: чи потрібно запускати повний набір перевірок і на commit, і на push. Поки лишу однаково, пізніше можу розділити.
- Не впевнена: чи працюватиме make на моєму Windows без додаткового встановлення. Перевірю.

# AI Interaction 4 - Build-перевірка та мінімальний smoke-тест

## Мета взаємодії

Уточнити, як організувати build-перевірку для Node.js + Express без компіляції та який мінімальний smoke-тест буде достатнім для перевірки працездатності застосунку.

## Prompt

Поясни, чи потрібна окрема build-перевірка для Node.js + Express проєкту, якщо немає процесу компіляції, і який мінімальний smoke-тест буде доречним?

## AI Response

Коротка відповідь: **окремий крок збірки в сенсі компіляції не потрібен, але якась «перевірка збірки» у hook усе ж корисна**, бо завдання прямо вимагає «збірку» і вона має бути чесною, тобто здатною впасти.

### Чи потрібна build-перевірка без компіляції

Для JavaScript без транспіляції «збірка» нічого не виробляє. Тому є два чесні варіанти:

1. **Перевірка завантаження (load check).** Мета: впевнитися, що код розбирається і всі `require` знаходять свої файли. Це ловить синтаксичні помилки, неіснуючі модулі й циклічні імпорти, які лінтер не бачить.
2. **Не мати кроку `build` взагалі**, а в стандарті написати: «для JS без транспіляції збірки немає, її роль виконують load check і smoke-тест». Це теж захищається, але ви втрачаєте явний пункт «збірка» з вимоги.

Я б залишив варіант 1 і не вдавав, що це компіляція. У `checks.md` напишіть прямо: «Збірка = перевірка, що застосунок завантажується».

Що **не** варто робити: `node --check src/index.js` перевіряє синтаксис лише одного файлу й не заходить у залежності; конструкція `|| echo "ok"` робить крок, який ніколи не падає, і це порожня перевірка.

### Мінімальна збірка

json

```json
"build": "node -e \"require('./src/index')\""
```

Вона завантажує точку входу разом з усіма модулями, які вона підключає. Упаде при синтаксичній помилці, невірному шляху в `require` або виключенні під час завантаження модуля.

Якщо з'явиться Express-застосунок із `createApp()`, збірку можна посилити: `node -e "require('./src/app').createApp()"`. Тоді перевіряється й створення застосунку, а не лише завантаження файлів.

### Мінімальний доречний smoke-тест

Smoke-тест відповідає на одне питання: «чи система взагалі живе?» Він не перевіряє бізнес-правила. Хороший тест:

- швидкий (мілісекунди);
- без зовнішніх залежностей (без БД, мережі, секретів);
- перевіряє **реальну поведінку**, а не `1 + 1 === 2`.

**Для вашого поточного стану** (модулі без сервера):

js

```js
const test = require('node:test');
const assert = require('node:assert');
const { main } = require('../src/index');

test('smoke: modules auth and tasks load', () => {
  const { auth, tasks } = main();
  assert.strictEqual(typeof auth.getCurrentUserId, 'function');
  assert.strictEqual(typeof tasks.listTasksFor, 'function');
});
```

**Коли з'явиться Express** (мінімум для HTTP):

js

```js
const test = require('node:test');
const assert = require('node:assert');
const { createApp } = require('../src/app');

test('smoke: app responds on /health', async () => {
  const server = createApp().listen(0);
  try {
    const { port } = server.address();
    const res = await fetch(`http://127.0.0.1:${port}/health`);
    assert.strictEqual(res.status, 200);
  } finally {
    server.close();
  }
});
```

Порт `0` означає «будь-який вільний», тож тест не конфліктує з запущеним сервером.

### Чим smoke-тест відрізняється від збірки

|          | Збірка (load check)               | Smoke-тест                               |
| -------- | --------------------------------- | ---------------------------------------- |
| Питання  | Код розбирається й підключається? | Ключова функція реально працює?          |
| Ловить   | Синтаксис, битий `require`, цикли | Зламану ініціалізацію, неробочий маршрут |
| Потребує | Лише Node                         | Те саме + виклик коду                    |

Вони доповнюють одне одного, тому в `check` є обидва.

## My Feedback

- Корисне: різниця між перевіркою завантаження застосунку і smoke-тестом. Перша перевіряє, чи код підключається, друга, чи працює базова поведінка.
- Погоджуюся: для JavaScript без транспіляції не треба вигадувати компіляцію; чесна перевірка завантаження краща за крок, який ніколи не падає.
- Беру до уваги: smoke-тест має перевіряти реальну поведінку й не залежати від БД чи мережі.
