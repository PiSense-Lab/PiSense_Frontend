<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# PiSense Frontend

Frontend application for PiSense — a lightweight UI client for uploading datasets, visualizing results, and interacting with the PiSense backend API. Built with React + Vite and styled with Tailwind CSS for a fast developer experience and responsive UI.

Key responsibilities:
- Dataset uploads and management
- Interactive visualizations
- Communicating with the PiSense backend API

## Tech Stack

- React — UI library
- Vite — Fast build tool and dev server
- Tailwind CSS — Utility-first styling
- JavaScript (ES6+)

Optional / recommended tooling:
- Node.js (16+)
- package manager: npm or Yarn

## Installation

Prerequisites:
- Node.js 16+ and npm (or Yarn)

Clone the repo and install dependencies:

```bash
git clone https://github.com/PiSense-Lab/PiSense_Frontend
cd PiSense-frontend
npm install
# or
# yarn install
```
## Run Locally

Start development server:

```bash
npm run dev
# or
# yarn dev
```

Open http://localhost:3000 to view the app.

Build for production:

```bash
npm run build
# preview the production build
npm run preview
```

Features

- Upload and manage datasets (CSV/EXCEL)
- Interactive visualization components for dataset exploration
- Communicates with the PiSense backend API for processing and storage
- Built with performance in mind using Vite and Tailwind CSS
>>>>>>> origin/main
