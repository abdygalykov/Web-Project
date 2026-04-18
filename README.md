# Web-Project
# Personal Finance Tracker and Analytics

## Description
A web application for managing personal finances. Users can track income and expenses, plan budgets, set financial goals, and analyze their spending habits with interactive charts and reports.

This project uses **Angular** for the frontend and **Django** for the backend, providing a full-stack solution with secure data storage and fast response.

---

## Features
- **User Authentication:** Registration and login (JWT / OAuth2)  
- **Transaction Management:** Add, edit, and delete income and expenses  
- **Categories & Goals:** Organize expenses by category and set financial goals  
- **Analytics:** Charts for income, expenses, savings, trends, and forecasts  
- **Budgeting:** Track monthly budgets with alerts for overspending  
- **Integrations:** Optional connection to banking APIs for importing transactions  

---

## Technologies
- **Frontend:** Angular 
- **Backend:** Django  
- **Database:** SQLite

---

## Team members
- Abdygalykov Dinmuhamed
- Olzhas

### Clone the repository
```bash
git clone https://github.com/username/finance-tracker.git
cd finance-tracker
```

## Public link for the site

The frontend can be published automatically to GitHub Pages after a push to `main`.

Expected public URL:

```bash
https://abdygalykov.github.io/Web-Project/
```

### What changed

- Added `.github/workflows/deploy-pages.yml` for automatic deployment
- Added Angular hash routing for correct work on static hosting
- Added `npm run build:pages` for GitHub Pages build

### How to enable it once on GitHub

1. Push the latest changes to the `main` branch.
2. Open repository `Settings` on GitHub.
3. Go to `Pages`.
4. In `Build and deployment`, choose `GitHub Actions`.
5. Wait until the `Deploy GitHub Pages` workflow finishes.

After that, the site will be available by the public link above and you will no longer need to show it from your local terminal.
