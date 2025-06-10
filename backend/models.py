from flask_sqlalchemy import SQLAlchemy
from datetime import timedelta, timezone, datetime
from sqlalchemy.sql import func


db = SQLAlchemy()
created_at = datetime.now(timezone.utc)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(256), nullable=False)

    polls = db.relationship("Poll",back_populates = "user",  cascade="all, delete-orphan")
    pollees = db.relationship("Pollee", back_populates="user",  cascade="all, delete-orphan")

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
    closing_date = db.Column(db.DateTime, nullable=True)
    time_limit_days = db.Column(db.Integer, default=30)

    user = db.relationship("User",back_populates = "polls")
    choices = db.relationship("Choice", back_populates="poll", cascade="all, delete-orphan")
    assignments = db.relationship("PollAssignment", back_populates="poll", cascade="all, delete-orphan")
    votes = db.relationship("Vote", back_populates="poll", cascade="all, delete-orphan")


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
    def pollee_view(self):
        return {
            "name": self.name,
            "id": self.id,
            "choices":[choice.serialize() for choice in self.choices]}

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
    category_id = db.Column(db.Integer, db.ForeignKey("category.id"), nullable=True)
    user_id= db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    user = db.relationship("User", back_populates="pollees")
    category = db.relationship("Category", back_populates="pollees")
    assignments = db.relationship("PollAssignment", back_populates="pollee")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "category": self.category_id,
        }
class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)

    pollees = db.relationship("Pollee", back_populates="category")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.email,
            "pollees": [pollee.serialize() for pollee in self.pollees]
        }

class PollAssignment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    poll_id = db.Column(db.Integer, db.ForeignKey('poll.id'), nullable=False)
    pollee_id = db.Column(db.Integer, db.ForeignKey('pollee.id'), nullable=False)

    poll = db.relationship("Poll", back_populates="assignments")
    pollee = db.relationship("Pollee", back_populates = "assignments")

    __table_args__ = (db.UniqueConstraint('poll_id', 'pollee_id', name='unique_assignment'),)

    def serialize(self):
        return {
            "id": self.id,
            "poll_id": self.poll_id,
            "pollee_id": self.pollee_id
        }
class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pollee_id = db.Column(db.Integer, db.ForeignKey("pollee.id"), nullable=False)
    poll_id = db.Column(db.Integer, db.ForeignKey("poll.id"), nullable=False)
    choice_id = db.Column(db.Integer, db.ForeignKey("choice.id"), nullable=False)
    unique_constraint = db.UniqueConstraint('pollee_id', 'poll_id', name='one_vote')

    poll = db.relationship("Poll", back_populates="votes")

    def serialize(self):
        return {
            "id": self.id,
            "pollee_id": self.pollee_id,
            "poll_id": self.poll_id,
            "choice_id": self.choice_id
            }
