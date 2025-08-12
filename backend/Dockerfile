# Dockerfile.backend
FROM python:3.11-slim

# Set working directory inside container
WORKDIR /polling-app/backend

# Copy entire project (preserving backend structure)
COPY ./backend /polling-app/backend/


RUN pip install --upgrade pip && \
    pip install -r requirements.txt


WORKDIR /polling-app/backend


EXPOSE 5000


CMD ["flask", "run", "--host=0.0.0.0"]
