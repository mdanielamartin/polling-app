from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
import bcrypt
from .models import db, User, Poll
from marshmallow import ValidationError
from .validation import UserSchema, PollSchema
from .utils import check_user
from datetime import timedelta

api_blueprint = Blueprint("server", __name__)

@api_blueprint.route("/user/register", methods=["POST"])
def add_user():
    data = request.json
    user_schema = UserSchema()
    try:
        validated_data = user_schema.load(data)
        if User.query.filter_by(email=validated_data['email']).first():
            return jsonify({"error": "Email already in use."}), 409
    except ValidationError as e:
        return jsonify({"error": e.messages}), 400
    try:
        hashed_password = bcrypt.hashpw(validated_data['password'].encode('utf-8'), bcrypt.gensalt())
        new_user = User(email=validated_data['email'], password=hashed_password.decode('utf-8'))
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": f"User added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_blueprint.route("/user/login", methods=["POST"])
def login_user():
    data = request.json
    user_schema = UserSchema()
    try:
        validated_data = user_schema.load(data)
        if not User.query.filter_by(email=validated_data['email']).first():
            return jsonify({"error": "Account not found, registration required"}), 404
    except ValidationError as e:
        return jsonify({"error": e.messages}), 400
    try:
        user = User.query.filter_by(email=validated_data['email']).first()
        verify_password = bcrypt.checkpw(validated_data['password'].encode('utf-8'), user.password.encode('utf-8'))
        if not verify_password:
            return jsonify({"error": "Invalid email/password combination"}), 401
        access_token = create_access_token(identity=str(user.id),additional_claims={"email": user.email}, expires_delta=timedelta(hours=1))
        return jsonify({"access_token": access_token}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_blueprint.route("/poll/create", methods=["POST"])
@jwt_required()
def create_poll():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({"error": "User not found"}), 404
    check_user = check_user(user_id)
    if not check_user:
        return jsonify({"error": "User not found"}), 404
    try:
        data = request.json
        poll_schema = PollSchema()
        validated_data = poll_schema.load(data)
    except ValidationError as e:
        return jsonify({"error": e.messages}), 400
    try:
        poll = Poll(validated_data)
        db.session.add(poll)
        db.session.commit()
        return jsonify({"id":poll.id}), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 500

@api_blueprint.route("/polls", methods=["GET"])
@jwt_required()
def get_polls():
    user_id = get_jwt_identity()
    check_user = check_user(user_id)
    if not check_user:
        return jsonify({"error": "User not found"}), 404
    try:
        polls = Poll.query.filter_by(user_id=user_id).all()
        return jsonify(polls), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 500
