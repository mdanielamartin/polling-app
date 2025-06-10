from backend import create_app
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from backend.commands import set_commands
from .models import db, Poll
from datetime import datetime, timezone
from apscheduler.schedulers.background import BackgroundScheduler


app = create_app()
migrate = Migrate(app, db)
jwt = JWTManager(app)
set_commands(app)
CORS(app)

def close_expired_polls():
    expired_polls = Poll.query.filter(Poll.closing_date <= datetime.now(timezone.utc), Poll.status == "active").all()

    for poll in expired_polls:
        poll.status = "completed"
        db.session.commit()

scheduler = BackgroundScheduler()
scheduler.add_job(close_expired_polls, "cron", hour=23, minute=59)

with app.app_context():
    scheduler.start()


if __name__ == "__main__":
    app.run(debug=True)  # Runs the server in debug mode for development
