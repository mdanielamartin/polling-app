from backend import create_app
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from backend.commands import set_commands
from .models import db


app = create_app()
migrate = Migrate(app, db)
jwt = JWTManager(app)
set_commands(app)
CORS(app)


if __name__ == "__main__":
    app.run(debug=True)  # Runs the server in debug mode for development
