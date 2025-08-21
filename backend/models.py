from flask_sqlalchemy import SQLAlchemy
from datetime import timedelta, timezone, datetime
from sqlalchemy.sql import func
from .extensions import db

created_at = datetime.now(timezone.utc)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(256), nullable=False)

    polls = db.relationship("Poll",back_populates = "user",  cascade="all, delete-orphan")
    pollees = db.relationship("Pollee", back_populates="user",  cascade="all, delete-orphan")
    lists = db.relationship("List", back_populates="user",  cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "email":self.email
        }

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
    time_limit_days = db.Column(db.Integer, default=30, nullable=False)
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
            "description":self.description,
            "publish_date": self.publish_date,
            "closing_date": self.closing_date,
            "time_limit_days": self.time_limit_days,
            "choices": [choice.serialize() for choice in self.choices]
        }

    def pollee_view(self):
        return {
            "name": self.name,
            "id": self.id,
            "description":self.description,
            "choices":[choice.serialize() for choice in self.choices]}

class Choice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    poll_id = db.Column(db.Integer, db.ForeignKey('poll.id'), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(500), nullable=True)

    poll = db.relationship("Poll", back_populates="choices")
    votes = db.relationship("Vote", back_populates="choices")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description
        }

list_member = db.Table('list_member',
    db.Column('pollee_id', db.Integer, db.ForeignKey('pollee.id'), primary_key=True),
    db.Column('list_id', db.Integer, db.ForeignKey('list.id'), primary_key=True)
)

class Pollee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), nullable=False)
    user_id= db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    user = db.relationship("User", back_populates="pollees")
    lists = db.relationship("List", secondary=list_member, back_populates="pollees")
    assignments = db.relationship("PollAssignment", back_populates="pollee",  cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
        }

class List(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id= db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(50), nullable=False)

    user = db.relationship("User",back_populates = "lists")
    pollees = db.relationship("Pollee", secondary=list_member, back_populates="lists")


    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "pollees": [pollee.serialize() for pollee in self.pollees]
        }


class PollAssignment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    poll_id = db.Column(db.Integer, db.ForeignKey('poll.id'), nullable=False)
    pollee_id = db.Column(db.Integer, db.ForeignKey('pollee.id'), nullable=False)
    status = db.Column(db.Boolean, default=False, nullable=True)
    poll = db.relationship("Poll", back_populates="assignments")
    pollee = db.relationship("Pollee", back_populates = "assignments", lazy="joined")

    __table_args__ = (db.UniqueConstraint('poll_id', 'pollee_id', name='unique_assignment'),)

    def serialize(self):
        return {
            "id": self.id,
            "poll_id": self.poll_id,
            "pollee_id": self.pollee_id,
            "email": self.pollee.email,
            "status":self.status
        }



class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    poll_id = db.Column(db.Integer, db.ForeignKey("poll.id"), nullable=False)
    choice_id = db.Column(db.Integer, db.ForeignKey("choice.id"), nullable=False)

    poll = db.relationship("Poll", back_populates="votes")
    choices = db.relationship("Choice", back_populates = "votes")
    def serialize(self):
        return {
            "id": self.id,
            "poll_id": self.poll_id,
            "choice_id": self.choice_id
            }
