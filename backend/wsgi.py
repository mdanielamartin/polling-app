from factory import create_app
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from models import Poll
from extensions import db
from datetime import datetime, timezone
from apscheduler.schedulers.background import BackgroundScheduler


app = create_app()
migrate = Migrate(app, db)




def close_expired_polls():
    with app.app_context():
        expired_polls = Poll.query.filter(
            Poll.closing_date <= datetime.now(timezone.utc),
            Poll.status == "active"
        ).all()

        for poll in expired_polls:
            poll.status = "completed"
        db.session.commit()


scheduler = BackgroundScheduler()
scheduler.add_job(close_expired_polls, "interval", minutes=15, next_run_time=datetime.now(timezone.utc))

with app.app_context():
    scheduler.start()