# Dockerfile.backend
FROM python:3.11-slim

# Set working directory inside container
WORKDIR /polling-app/backend


COPY ./backend /polling-app/backend/


RUN pip install --upgrade pip && \
    apt-get update && apt-get install -y \
    build-essential \
    libffi-dev \
    python3-dev \
    gcc \
    && pip install --no-cache-dir -r requirements.txt \
    && apt-get clean


WORKDIR /polling-app/backend


EXPOSE 5000

ENV FLASK_ENV=production

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "wsgi:app", "--workers=4", "--timeout=120"]

