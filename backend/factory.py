from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from config import Config
from routes import api_blueprint
from models import db
from extensions import db,jwt
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config["JWT_SECRET_KEY"] = "SUPERSTRONGSECRET"
    db.init_app(app)
    app.register_blueprint(api_blueprint, url_prefix="/api") 
    jwt.init_app(app)
    CORS(app, supports_credentials=True, origins=["https://polling-app-1yvh.onrender.com"])
    with app.app_context():
        db.create_all()
    return app