# RecipeVault

> A smart vault for storing, managing and discovering recipes

## 🔗 Links

* **GitHub Repository**: [https://github.com/adnankunjoo/RecipeVault]
* **Live Demo/Deploy Link**: []

## 📖 Project Description & Summary

RecipeVault is a web application that enables users to store, organise, search and manage their cooking recipes in a secure, intuitive interface. Whether you’re a home cook or a foodie developer, this app offers:

* Easy-to-use CRUD operations (Create, Read, Update, Delete) for recipes
* User authentication and personal vaults so each user has their own private collection
* (Optional) Search/filter functionality to find recipes quickly
* (Optional) Tagging or categorisation of recipes (e.g., “Vegetarian”, “Dessert”, “Quick meals”)
* (Optional) Responsive design to use on mobile/tablet/desktop

The goal is to provide a clean, maintainable codebase where front-end and back-end integrate well and users can deploy and use the application easily.

## 🛠 Tools & Technologies Used

Here’s a breakdown of the main tech stack and libraries for this project:

* Front-End: *[e.g., React / Vue / Angular / plain HTML+CSS+JavaScript]*
* Back-End: *[e.g., Node.js + Express / Python + Flask / Ruby on Rails]*
* Database: *[e.g., MongoDB / PostgreSQL / MySQL]*
* Authentication: *[e.g., JWT / Passport.js / Devise]*
* Deployment: *[e.g., Heroku / Netlify / AWS / DigitalOcean]*
* Version control: Git + GitHub
* Additional libraries/tools: *[e.g., Axios or Fetch for HTTP, bcrypt for hashing, dotenv for environment variables, CSS framework like Tailwind or Bootstrap]*

> *You should replace the bracketed parts above with your actual stack.*

## 🚀 Getting Started — How to Clone & Run Locally

Follow these steps to get the project running on your local machine:

### Prerequisites

* Node.js (version X or higher) *or* the applicable runtime for your back-end
* Package manager (npm, yarn)
* Database installed and running (if not using an embedded / cloud DB)
* (Optional) .env file with environment variables (e.g., database URI, secret keys)

### Setup & Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/adnankunjoo/RecipeVault.git
   cd RecipeVault
   ```
2. Install dependencies:

   ```bash
   npm install
   ```

   *Or substitute `yarn install` if using Yarn.*
3. Configure environment variables:

   ```bash
   cp .env.example .env
   # Then edit .env to include your DB_URL, JWT_SECRET, PORT, etc.
   ```
4. Set up the database (if applicable):

   * Create the database (e.g., `recipevault_db`)
   * Run migrations (if using SQL) or ensure Mongo collection exists

   ```bash
   npm run migrate   # example if migrations exist
   ```
5. Start the development server:

   ```bash
   npm start
   ```

   Or if you use nodemon:

   ```bash
   npm run dev
   ```
6. Open your browser and navigate to:

   ```
   http://localhost:3000
   ```

   *(Replace `3000` with your configured port if different.)*


## 🔍 Features & Future Work

### Current Features

* User registration + login
* Add, edit, delete recipes
* View recipe details
* Search/filter by recipe name or category
* Responsive design

### Planned Enhancements

* User profile & avatar upload
* Recipe image upload + gallery
* Social sharing of recipes
* Favourite/bookmark system
* Pagination & infinite scroll
* Dark mode theme

## 👤 Author

**Adnan**

* GitHub: [@adnankunjoo](https://github.com/adnankunjoo)

## ✅ Licence

This project is released under the [MIT License](LICENSE) (or specify whichever licence you’re using).
Feel free to use, copy, modify and distribute it — just include this licence in your distribution.
