from flask_sqlalchemy import SQLAlchemy
from datetime import timedelta, timezone, datetime
from sqlalchemy.sql import func


db = SQLAlchemy()
created_at = datetime.now(timezone.utc)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(256), nullable=False)

def get_utc_time():
    return datetime.now(timezone.utc)

class Poll(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=get_utc_time())
    status = db.Column(db.String(20), nullable=False, default="draft")
    publish_date=db.Column(db.DateTime, nullable=True)
    time_limit_days = db.Column(db.Integer, default=30)

    def is_expired(self):
        if self.status == 'published' and timezone.utc > self.publish_date + timedelta(days=self.time_limit_days):
            self.status = 'completed'
            db.session.commit()
            return True
        return False


    def serialize(self):
        return {
            "name": self.name,
            "id": self.id,
            "user_id": self.user_id,
            "created_at": self.created_at,
            "status": self.status,
            "publish_date": self.publish_date,
            "time_limit_days": self.time_limit_days
        }
