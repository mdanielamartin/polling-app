from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
import bcrypt
from .models import db, User, Poll, Choice, Pollee, PollAssignment
from marshmallow import ValidationError
from .validation import UserSchema, PollSchema, ChoiceSchema, PolleeSchema, PollAssignmentSchema
from .utils import check_user, generate_url
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
    auth = check_user(user_id)
    if not auth:
        return jsonify({"error": "User not found"}), 404
    try:
        data = request.json
        poll_schema = PollSchema()
        validated_data = poll_schema.load(data)
    except ValidationError as e:
        return jsonify({"error": e.messages}), 400
    try:
        poll = Poll(name=validated_data["name"],time_limit_days=validated_data["time_limit_days"], user_id=user_id)
        db.session.add(poll)
        db.session.commit()
        return jsonify({"id":poll.id}), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 500

@api_blueprint.route("/polls", methods=["GET"])
@jwt_required()
def get_polls():
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify({"error": "User not found"}), 404
    try:
        polls = Poll.query.filter_by(user_id=user_id).all()
        poll_list = [poll.serialize() for poll in polls]
        return jsonify(poll_list), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 500

@api_blueprint.route("/poll/update/<int:id>", methods=["PUT"])
@jwt_required()
def update_poll(id):
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify({"error": "User not found"}), 404
    try:
        data = request.json
        poll_schema = PollSchema()
        validated_data = poll_schema.load(data)
    except ValidationError as e:
        return jsonify({"error": e.messages}), 400
    try:
        poll = Poll.query.get(id)
        if not poll:
            return jsonify({"error": "Poll not found"}), 404
        for key,value in validated_data.items():
            if hasattr(poll,key):
                setattr(poll,key,value)
        db.session.commit()
        return jsonify({"id":poll.id}), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 500

@api_blueprint.route("/poll/delete/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_poll(id):
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify({"error": "User not found"}), 404
    try:
        poll = Poll.query.get(id)
        if not poll:
            return jsonify({"error": "Poll not found"}), 404
        if poll.status == "draft" or poll.status == "completed":
            db.session.delete(poll)
            db.session.commit()
            return jsonify({"message":f"Poll {id} deleted"}), 200
        return jsonify({"error": "Only unpublished or completed polls can be deleted"}), 400
    except Exception as e:
        return jsonify({"error":str(e)}), 500

@api_blueprint.route("/poll/<int:id>/add/choice", methods=["POST"])
@jwt_required()
def add_choice(id):
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify({"error": "User not found"}), 404
    try:
        data = request.json
        choice_schema = ChoiceSchema()
        choice_data = choice_schema.load(data)
    except ValidationError as e:
        return jsonify({"error": e.messages}), 400
    try:
        poll = Poll.query.filter_by(id=id, user_id=user_id).first()
        if not poll:
            return jsonify({"error": "Poll not found"}), 404
        if poll.status == "draft":
            choice = Choice(poll_id = id, name=choice_data["name"], description = choice_data["description"])
            db.session.add(choice)
            db.session.commit()
            return jsonify(choice.serialize()), 200
        return jsonify({"error": "Only polls with draft status can be modified"}), 400
    except Exception as e:
        return jsonify({"error":str(e)}), 500

@api_blueprint.route("/poll/<int:id>/update/choice", methods=["PUT"])
@jwt_required()
def update_choice(id):
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify({"error": "User not found"}), 404
    try:
        data = request.json
        choice_id = data.get("id")
        choice_schema = ChoiceSchema()
        choice_data = choice_schema.load(data)
    except ValidationError as e:
        return jsonify({"error": e.messages}), 400
    try:
        poll = Poll.query.filter_by(id=id, user_id=user_id).first()
        if not poll:
            return jsonify({"error": "Poll not found"}), 404
        if poll.status == "draft" and choice_id:
            choice = Choice.query.get(choice_id)
            if not choice:
                 return jsonify({"error": "Choice not found"}), 404

            for key,value in choice_data.items():
                if hasattr(choice,key):
                    setattr(choice,key,value)
            db.session.commit()
            return jsonify(choice.serialize()), 200
        return jsonify({"error": "Only polls with draft status can be modified"}), 400
    except Exception as e:
        return jsonify({"error":str(e)}), 500

@api_blueprint.route("/poll/<int:id>/delete/choice/<int:choice_id>", methods=["DELETE"])
@jwt_required()
def delete_choice(id, choice_id):
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify({"error": "User not found"}), 404
    try:
        poll = Poll.query.filter_by(id=id, user_id=user_id).first()
        if not poll:
            return jsonify({"error": "Poll not found"}), 404
        if poll.status == "draft" and choice_id:
            choice = Choice.query.get(choice_id)
            if not choice:
                 return jsonify({"error": "Choice not found"}), 404
            db.session.delete(choice)
            db.session.commit()
            return jsonify({"message":f"Choice {choice.id} deleted in poll {id}"}), 200
        return jsonify({"error": "Only polls with draft status can be modified"}), 400
    except Exception as e:
        return jsonify({"error":str(e)}), 500

@api_blueprint.route("/poll/<int:id>", methods=["GET"])
@jwt_required()
def get_poll(id):
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify({"error": "User not found"}), 404
    try:
        poll = Poll.query.filter_by(user_id=user_id, id=id).first()
        poll_data = poll.serialize()
        poll_data["choices"] = [choice.serialize() for choice in poll.choices]
        return jsonify(poll_data), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 500


@api_blueprint.route("/pollee/add", methods=["POST"])
@jwt_required()
def add_pollee():
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify({"error": "User not found"}), 404
    try:
        data = request.json
        pollee_schema = PolleeSchema()
        validated_data = pollee_schema.load(data)
        category_id = data.get("category_id")
    except ValidationError as e:
        return jsonify({"error": e.messages}), 400
    try:
        pollee = Pollee(user_id=user_id,category_id = category_id, email = validated_data["email"])
        db.session.add(pollee)
        db.session.commit()
        return jsonify(pollee.serialize()), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 500

@api_blueprint.route("/pollees", methods=["GET"])
@jwt_required()
def get_pollees():
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify({"error": "User not found"}), 404
    try:
        pollees = Pollee.query.filter_by(user_id=user_id).all()
        pollees_list = [pollee.serialize() for pollee in pollees]
        return jsonify(pollees_list), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 500

@api_blueprint.route("/pollee/assignment", methods=["POST"])
@jwt_required()
def assign_pollee():
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify({"error": "User not found"}), 404
    try:
        data = request.json
        assign_schema = PollAssignmentSchema()
        validated_data = assign_schema.load(data)
    except ValidationError as e:
        return jsonify({"error": e.messages}), 400
    try:
        poll = Poll.query.get(validated_data["poll_id"])
        if str(poll.user_id) != user_id:
            return jsonify({"error": "Bad Request"}), 400
        assignment = PollAssignment(**validated_data)
        db.session.add(assignment)
        db.session.commit()
        return jsonify(f"Pollee {validated_data["pollee_id"]} has been assigned to poll {poll.id}"), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 500

@api_blueprint.route("/poll/activate/<int:id>", methods=["PUT"])
@jwt_required()
def activate_poll(id):
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify({"error": "User not found"}), 404
    try:
        poll = Poll.query.filter_by(id=id, user_id=user_id).first()
        if not poll:
            return jsonify({"error": "Poll not found"}), 404
        poll.status = "active"
        assignments = PollAssignment.query.filter_by(poll_id=id).all()
        tokens = [generate_url(pollee.id,pollee.pollee.email,id,poll.time_limit_days) for pollee in assignments]
        db.session.commit()
        return jsonify({"id":tokens}), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 500
