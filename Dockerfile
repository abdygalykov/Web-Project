FROM node:22-bookworm-slim AS frontend-builder

WORKDIR /app/FinanceTracker/frontend

COPY FinanceTracker/frontend/package.json FinanceTracker/frontend/package-lock.json ./
RUN npm ci

COPY FinanceTracker/frontend/ ./
RUN node ./node_modules/@angular/cli/bin/ng.js build


FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=10000

WORKDIR /app/FinanceTracker/backend

COPY FinanceTracker/backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY FinanceTracker/backend/ ./
COPY --from=frontend-builder /app/FinanceTracker/frontend/dist/site /app/FinanceTracker/frontend/dist/site

RUN python manage.py collectstatic --noinput

CMD ["sh", "-c", "python manage.py migrate && gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-10000}"]
