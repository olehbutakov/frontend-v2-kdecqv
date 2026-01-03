# Test assignment App

This project was created with `npm create vite@latest my-app -- --template react-ts` command.
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Table of Contents
- [Initial Setup](#initial-setup)
- [Testing and Formatting](#testing-and-formatting)
- [Internationalization (i18n)](#internationalization-i18n)
- [Project Structure](#project-structure)
- [Potential Improvements](#potential-improvements)

## Initial Setup

### Prerequisites
- Node.js 24+ (version used during project setup)
- npm 11+ (version used during project setup)

### Step 1: Install Dependencies

In the root of the project run:

```bash
npm install
```

### Step 2: Run the app

In the root of the project run:

```bash
npm start
```
App should be running at `http://localhost:5173`

### Build for production

```bash
npm run build
```

## Testing and Formatting

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with coverage report:

```bash
npm run test:watch
```

**NOTE:** This project enforces minimum code coverage:
- **Lines**: 70%
- **Branches**: 70%

Coverage reports are generated in `coverage/` folder.

Run ESLint:

```bash
npm run lint
```

Format code with Prettier:

```bash
npm run format
```

Check code formatting:

```bash
npm run format:check
```

## Internationalization (i18n)

This project uses a **custom, lightweight i18n solution** instead of third-party libraries.

### Currently supported locales (for demonstration purposes only)
- 🇺🇸 English (US) - `en-US` (default)
- 🇨🇦 French (Canada) - `fr-CA`

### Adding new translations
1. Add key to `src/i18n/translations/en-US.json` (preferably in format like `applications.form.firstName.label`)
2. Add corresponding translation to `fr-CA.json` in the same folder
3. Use in components `t('applications.form.firstName.label')`


## Project Structure

```bash
src/
├── i18n/                   # Internationalization
│   ├── translations/       # Translation JSON files
│   ├── types.ts            # i18n type definitions
│   └── I18nContext.tsx     # i18n Context Provider
├── components/
│   └── common/
│       └── LanguageSwitcher/ # Components are stored in their own folders with all related files
│           ├── __tests__/
│           ├── components/ (optional)
│           ├── LanguageSwitcher.css (optional)
│           └── LanguageSwitcher.tsx
├── pages/                  # Page components
│   └── Home/
│       ├── __tests__/
│       ├── components/ (optional)
│       ├── Home.css (optional)
│       └── Home.tsx
├── services/               # API services
│   ├── __tests__/
│   └── api.ts
├── hooks/                  # Reusable hooks
│   ├── __tests__/
│   └── useAxios.ts
├── types/                  # Shared types
│   └── index.ts
├── test/
│   ├── utils.tsx           # Custom test utilities
│   └── setupTests.ts       # Jest setup
├── App.tsx                 # Main app component
└── main.tsx                # Entry point
```


## Potential Improvements

Here's a list of things that I think could improve this tiny app:

- Add products search
- Add applications table search
- Save selected locale. Could be done in multiple ways like using query params, localStorage or handle via backend as a user specific setting or combination of those
- Get preferred locale from browser headers or from the store of choice
