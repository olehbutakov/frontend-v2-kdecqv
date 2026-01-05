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
├── context/
│   └── ProductContext.tsx
├── components/
│   └── ApplicationsList/
│       └── ApplicationsList/ # Components are stored in their own folders with all related files
│           ├── __tests__/
│           ├── components/ (optional)
│           ├── ApplicationsList.css (optional)
│           └── ApplicationsList.tsx
│   └── common/             # Shared/base components
│       └── LanguageSwitcher/
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
├── utils/                  # Helper functions like form validation
│   └── form.ts
├── test/
│   ├── utils.tsx           # Custom test utilities
│   └── setupTests.ts       # Jest setup
├── App.tsx                 # Main app component
└── main.tsx                # Entry point
```


## Potential Improvements

Here's a list of things(in no particular order and could be extended) that I think could improve this tiny app:

- Add products search
- Add pagination or infinite scroll to products list, but this should be ideally handled on a backend
- Same with the table + sort functionality
- Add applications table search
- Table styling is also not ideal, would be great to make header row sticky and table scrollable horizontally
- Maybe refactor products list a bit + add something like tabs on mobile so that we could show 1 list at a time. Currently you have to scroll to see variable products
- Save selected locale. Could be done in multiple ways like using query params, localStorage or handle via backend as a user specific setting or combination of those
- I localized some things like product type to showcase I18n stuff I set up, but ideally everything we get from the API should either be localized there or shown as is
- I made custom I18n for the assignment, but ideally we should be using libraries like react-i18next or React Intl (FormatJS) to handle plurals, for better interpolation, formatting, lazy loading translations etc. Though it is possible to gradually migrate from current approach towards proper library
- Get preferred locale from browser headers or from the store of choice
- Extract form into a shared component and improve fields validation
- Use react hook form to work with forms
- Use React Portal to show drawer to ensure it exists above other content and avoids stacking context issues
- If drawer/overlay were used outside of Header, I'd also moved their state handling into a context
- I made a bunch of hooks based on axios instance, but they don't handle refetch, caching etc. In a prod app I'd use something like TanStack query or something like that depending on the API type
- I extracted products fetch logic into a context, but ideally we don't want to fetch all products on any page, but I didn't have GET product endpoint, so decided to do that to get productId or name when needed
- As requested I notify users when they successfully update applicant data, but would be better to use toasts or something like that
- Add light/dark theme handling
- For testing I use Jest and react testing library, but potentially 
- Extract routes into a separate file
- For styling I wanted to use emotion styled components, but decided to use plain CSS instead for simplicity
