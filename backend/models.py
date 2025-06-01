from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Poll(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(50), default="open")
