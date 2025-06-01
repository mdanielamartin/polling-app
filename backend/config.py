import os
class Config:
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = "postgresql://mdmpereira:nina@localhost:5432/poll_app"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    TEMPLATES_AUTO_RELOAD = True
