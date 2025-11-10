# 🎬 Movie App - Angular Application

![Angular](https://img.shields.io/badge/Angular-20.3.0-red?style=for-the-badge\&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue?style=for-the-badge\&logo=typescript)
![Material Design](https://img.shields.io/badge/Material-20.2.12-blue?style=for-the-badge\&logo=material-design)

A modern web application built with Angular 20 for browsing and exploring movies through a beautiful and user-friendly interface.

---

## 🚀 Getting Started

### Prerequisites

* **Node.js**: Version 18.x or higher
* **npm**: Version 9.x or higher (comes with Node.js)
* **Angular CLI**: Will be installed automatically with the project

### Installation & Running

#### Step 1: Clone the Repository

```bash
git clone https://github.com/heshamAsayed/angular-movie-app.git
cd angular-movie-app
```

#### Step 2: Install Dependencies

**⚠️ Important:** You **MUST** run `npm install` first to install all required packages including Angular Material v20.

```bash
npm install
```

This will install all required packages:

* Angular Core & CLI (v20.3.0)
* Angular Material (v20.2.12)
* Angular CDK (v20.2.12)
* RxJS
* And other required dependencies

#### Step 3: Start Development Server

```bash
ng serve
# or
npm start
```

Open your browser and navigate to `http://localhost:4200`. The application will automatically reload whenever you modify any source files.

#### Step 4: Build for Production

```bash
ng build
# or
npm run build
```

The build artifacts will be stored in the `dist/` directory, optimized for production.

---

## ✨ Features

* 🎬 **Movie Browsing**: Explore a wide range of movies with comprehensive details
* 🔍 **Search & Filter**: Search movies by title and filter by genre
* 📱 **Responsive Design**: Works perfectly on all devices
* 🌙 **Light/Dark Mode**: Easy switching between modes with preference saving
* 🌍 **Multi-language Support**: Support for English, Arabic, French, and Chinese
* ⭐ **Rating System**: Visual movie rating display
* 💾 **Watchlist**: Save favorite movies to watchlist
* 🎨 **Material Design UI**: Modern UI using Angular Material v20
* ⚡ **High Performance**: Fast loading and instant responsiveness

---

## 👥 Development Team

### Developers

**[Mohamed Galal](https://github.com/MohamedGll), [Mohamed Nasser](https://github.com/Mohammed20367), [Ahmed Fawzy](https://github.com/ahmed-fawzy2000), [Andrew Nassim](https://github.com/andrew-nassim), [Hesham Ahmed](https://github.com/heshamAsayed)**

### Supervisor

* **Hassan Eldash**

---

## 🎨 Color System & Customization

### Overview

The project uses a color system based on **CSS Variables** for easy customization and switching between light and dark modes. All colors are documented in `custom-theme.scss`.

### Light Mode Colors

#### Primary Colors

```css
--primary-color: #1565c0;    /* Primary color */
--accent-color: #d81b60;     /* Secondary color */
--warn-color: #d32f2f;       /* Warning color */
```

#### Background Colors

```css
--surface-bg: #ffffff;       /* Page background */
--card-bg: #fafafa;          /* Card background */
--hover-overlay: rgba(21, 101, 192, 0.06);  /* Hover overlay */
```

#### Text Colors

```css
--primary-text: #000000;     /* Primary text */
--secondary-text: #424242;   /* Secondary text */
--muted-text: #757575;       /* Muted text */
```

### Dark Mode Colors

#### Background Colors

```css
--surface-bg: #0f1419;       /* Page background (blue-black) */
--card-bg: #1a1f29;          /* Card background (dark gray) */
--hover-overlay: rgba(100, 181, 246, 0.08);  /* Hover overlay */
```

#### Text Colors

```css
--primary-text: #ffffff;     /* Primary text (white) */
--secondary-text: #e0e0e0;   /* Secondary text (light gray) */
--muted-text: #9e9e9e;       /* Muted text (medium gray) */
```

### How to Customize Colors

#### Method 1: Edit `custom-theme.scss`

Open `src/custom-theme.scss` and modify the variables in the `:root` section for light mode or `.dark-mode` for dark mode.

```scss
:root {
  --primary-color: #your-color-here;
  --surface-bg: #your-background-color;
  --primary-text: #your-text-color;
}

.dark-mode {
  --primary-color: #your-dark-color;
  --surface-bg: #your-dark-background;
  --primary-text: #your-dark-text;
}
```

#### Method 2: Use Variables in CSS

In any CSS or SCSS file, use the variables directly:

```css
.my-component {
  background-color: var(--surface-bg);
  color: var(--primary-text);
  border: 1px solid var(--card-border);
}
```

#### Method 3: Toggle Between Modes

Switching between light and dark modes happens automatically when clicking the toggle button in the navigation bar. The preference is automatically saved in `localStorage`.

---

## 📜 Available Commands

```bash
# Development
ng serve              # Start development server
npm start             # Start development server
ng build              # Build for development
npm run watch         # Build with watch mode

# Production
ng build --configuration production  # Build for production

# Testing
ng test               # Run unit tests
npm test              # Run unit tests

# Code Generation
ng generate component component-name  # Generate new component
ng generate service service-name      # Generate new service
```

---

## 🛠️ Technologies Used

* **Angular 20.3.0**: Core framework
* **TypeScript 5.9.2**: Programming language
* **Angular Material 20.2.12**: UI components
* **RxJS 7.8.0**: Reactive programming
* **Angular CDK 20.2.12**: Angular tools

---

## 📄 License

This project is licensed under the MIT License.

---

**⭐ If you like this project, don't forget to give it a star!**
