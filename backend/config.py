import os

DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql://mdmpereira:nina@db:5432/poll_app")
class Config:
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    TEMPLATES_AUTO_RELOAD = True
