from flask_sqlalchemy import SQLAlchemy
from datetime import timedelta, timezone


db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(256), nullable=False)


class Poll(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=timezone.utc)
    status = db.Column(db.Enum('draft', 'published', 'completed', name="status"), default='draft')
    publish_date=db.Column(db.DateTime, nullable=True)
    time_limit_days = db.Column(db.Integer, default=30)

    def is_expired(self):
        if self.status == 'published' and timezone.utc > self.publish_date + timedelta(days=self.time_limit_days):
            self.status = 'completed'
            db.session.commit()
            return True
        return False
