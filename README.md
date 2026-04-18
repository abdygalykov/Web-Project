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

## Full-stack deployment

The repository is now prepared for a single full-stack deploy:

- Angular frontend is built inside the Docker image
- Django serves both `/api/...` and the Angular app from the same domain
- PostgreSQL is provisioned through `render.yaml`

### Recommended deploy target

Render blueprint from the repo root:

- [render.yaml](/Users/dimashabdygalykov/Desktop/Web-Project/Web-Project/render.yaml)
- [Dockerfile](/Users/dimashabdygalykov/Desktop/Web-Project/Web-Project/Dockerfile)

### What the single deploy does

1. Builds Angular in Docker
2. Copies the compiled frontend into the Django app
3. Runs Django migrations
4. Serves the whole site from one public URL

### Local architecture now

- Frontend uses real Django API via `/api`
- JWT auth is used for login/register/session
- Django can serve the compiled Angular build directly
