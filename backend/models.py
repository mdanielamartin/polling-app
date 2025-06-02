from flask_sqlalchemy import SQLAlchemy
from datetime import timedelta, timezone, datetime
from sqlalchemy.sql import func


db = SQLAlchemy()
created_at = datetime.now(timezone.utc)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(256), nullable=False)

    polls = db.relationship("Poll",back_populates = "user")

def get_utc_time():
    return datetime.now(timezone.utc)

class Poll(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=get_utc_time())
    status = db.Column(db.String(20), nullable=False, default="draft")
    publish_date=db.Column(db.DateTime, nullable=True)
    time_limit_days = db.Column(db.Integer, default=30)

    user = db.relationship("User",back_populates = "polls")
    choices = db.relationship("Choice", back_populates="poll", cascade="all, delete-orphan")
    passkeys = db.relationship("Passkey", back_populates="poll", cascade="all, delete-orphan")
    votes = db.relationship("Vote", back_populates="poll", cascade="all, delete-orphan")

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

class Choice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    poll_id = db.Column(db.Integer, db.ForeignKey('poll.id'), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(500), nullable=True)

    poll = db.relationship("Poll", back_populates="choices")

    def serialize(self):
        return {
            "id": self.id,
            "poll_id": self.poll_id,
            "name": self.name,
            "description": self.description
        }

class Pollee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), nullable=False)


class Passkey(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    poll_id = db.Column(db.Integer, db.ForeignKey('poll.id'), nullable=False)
    pollee_id = db.Column(db.Integer, db.ForeignKey('poll.id'), nullable=False)
    passkey = db.Column(db.String(10), nullable=False, unique=True)

    poll = db.relationship("Poll", back_populates="passkeys")

class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pollee_id = db.Column(db.Integer, db.ForeignKey("pollee.id"), nullable=False)
    poll_id = db.Column(db.Integer, db.ForeignKey("poll.id"), nullable=False)
    choice_id = db.Column(db.Integer, db.ForeignKey("choice.id"), nullable=False)
    unique_constraint = db.UniqueConstraint('pollee_id', 'poll_id', name='one_vote')

    poll = db.relationship("Poll", back_populates="votes")
