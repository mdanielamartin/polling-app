from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity, get_jwt, verify_jwt_in_request
from jwt.exceptions import ExpiredSignatureError
import bcrypt
from .models import db, User, Poll, Choice, Pollee, PollAssignment, Vote, List
from marshmallow import ValidationError
from .validation import UserSchema, PollSchema, ChoiceSchema, PolleeSchema, PollAssignmentSchema, VoteSchema, ListSchema
from .utils import check_user, generate_url, send_token_email
from datetime import timedelta, timezone, datetime
from sqlalchemy import func

api_blueprint = Blueprint("api", __name__)

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
        poll = Poll.query.filter_by(id=id,user_id=user_id).first()
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
        poll = Poll.query.filter_by(id=id,user_id=user_id).first()
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
            choice = Choice.query.filter_by(id=choice_id, poll_id=id).first()
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
        if not poll:
            return jsonify({"error": "Poll not found"}), 404
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
        list_id = data.get("list_id", None)
    except ValidationError as e:
        return jsonify({"error": e.messages}), 400
    try:
        pollee = Pollee(user_id=user_id,list_id = list_id, email = validated_data["email"])
        db.session.add(pollee)
        db.session.commit()
        return jsonify(pollee.serialize()), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 500

@api_blueprint.route("/pollee/delete", methods=["DELETE"])
@jwt_required()
def delete_pollee():
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify({"error": "User not found"}), 404
    try:
        data = request.json
        if isinstance(data, list):
            for elem in data:
                if not isinstance(elem["pollee_id"],int):
                    return jsonify({"error": "Invalid data format"}), 400
        else:
            return jsonify({"error": "Invalid data format"}), 400

        for elem in data:
            pollee = Pollee.query.filter_by(id=elem["pollee_id"],user_id=user_id).first()
            if not pollee:
                return jsonify({"error": "Pollee not found"}), 404
            db.session.delete(pollee)
        db.session.commit()
        return jsonify({"message":"Pollees have been deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 500

@api_blueprint.route("/pollee/update", methods=["PUT"])
@jwt_required()
def update_pollee():
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify({"error": "User not found"}), 404
    try:
        data = request.json
        poll_schema = PolleeSchema()
        validated_data = poll_schema.load(data)
    except ValidationError as e:
        return jsonify({"error": e.messages}), 400
    try:
        pollee = Pollee.query.filter_by(id=validated_data["id"],user_id=user_id).first()
        if not pollee:
            return jsonify({"error": "Pollee not found"}), 404
        for key,value in validated_data.items():
            if hasattr(pollee,key):
                setattr(pollee,key,value)
        db.session.commit()
        return jsonify({"id":pollee.id}), 200
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

@api_blueprint.route("/pollee/assignment/<int:poll_id>", methods=["POST"])
@jwt_required()
def assign_pollee(poll_id):
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify({"error": "User not found"}), 404
    try:
        data = request.json
        if not isinstance(data, list):  # Ensure it's a list
            return jsonify({"error": "Invalid data format"}), 400
        assign_schema = PollAssignmentSchema(many=True)
        validated_data = assign_schema.load(data)
    except ValidationError as e:
        return jsonify({"error": e.messages}), 400
    try:
        poll = Poll.query.get(poll_id)
        if not poll or str(poll.user_id) != user_id:
            return jsonify({"error": "Unauthorized access"}), 401
        result = []
        for assignment in validated_data:
            poll_assign = PollAssignment(poll_id=poll_id,pollee_id=assignment["pollee_id"])
            db.session.add(poll_assign)
            db.session.commit()
            result.append(poll_assign.serialize())
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 500

@api_blueprint.route("/pollee/assignment/<int:poll_id>", methods=["DELETE"])
@jwt_required()
def assign_delete(poll_id):
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify({"error": "User not found"}), 404
    try:
        data = request.json
        if not isinstance(data, list):  # Ensure it's a list
            return jsonify({"error": "Invalid data format"}), 400
    except ValidationError as e:
        return jsonify({"error": e.messages}), 400
    try:
        poll = Poll.query.filter_by(id=poll_id).first()
        if not poll or str(poll.user_id) != user_id or poll.status=="active":
            return jsonify({"error": "Unauthorized access"}), 401
        for element in data:
            if not isinstance(element["id"],int):
                return jsonify({"error": "Invalid data format"}), 400
            assignment = PollAssignment.query.filter_by(id=element["id"],poll_id=poll_id).first()
            if not assignment:
                continue
            db.session.delete(assignment)
        db.session.commit()
        return jsonify({"message":"Assignments deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 500

@api_blueprint.route("/pollee/assignment/<int:poll_id>", methods=["GET"])
@jwt_required()
def get_assignments(poll_id):
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify({"error": "User not found"}), 404
    try:
        assignments = PollAssignment.query.filter_by(poll_id=poll_id).all()
        assignment_list = [assignment.serialize() for assignment in assignments]
        return jsonify(assignment_list), 200
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
        if poll.status == 'active':
            return jsonify({"error": "This poll is already active"}), 400
        activation_date = datetime.now()
        closing_date = (activation_date + timedelta(days=poll.time_limit_days))
        closing_date = datetime(closing_date.year, closing_date.month, closing_date.day, 23, 59, 59)

        poll.status = "active"
        poll.publish_date = activation_date
        poll.closing_date = closing_date
        assignments = PollAssignment.query.filter_by(poll_id=id).all()
        if not assignments:
            return jsonify({"error": "Poll has not been assigned to a contact"}), 400
        fails = []
        for pollee in assignments:
            token = generate_url(pollee.pollee_id,id,poll.closing_date)
            send_result = send_token_email(pollee.pollee.email,token, poll.closing_date,poll.name, pollee.pollee_id)
            if send_result["pollee_id"]:
                fails.append(send_result["pollee_id"])
        db.session.commit()
        if fails:
            return {"error":fails}, 400
        return jsonify({"message":"All emails sent successfully"}), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 500

@api_blueprint.route("/pollee/vote", methods=["POST"])
@jwt_required()
def vote_pollee():
    poll_id = get_jwt_identity()
    claims = get_jwt()
    pollee_id = claims.get('pollee_id')
    try:
        data = request.json
        vote_schema = VoteSchema()
        validated_data = vote_schema.load(data)
    except ValidationError as e:
        return jsonify({"error": e.messages}), 400
    try:
        assignment = PollAssignment.query.filter_by(poll_id=poll_id,pollee_id=pollee_id).first()
        if not assignment:
            return jsonify({"error": "You do not have permission to vote"}), 409
        poll = Poll.query.get(poll_id)
        if poll.status != 'active':
            return jsonify({"error": "This poll has closed"}), 400
        choice = Choice.query.filter_by(poll_id=poll_id,id=validated_data["choice_id"]).first()
        if choice:
            vote = Vote(pollee_id = pollee_id,poll_id=poll_id, choice_id=validated_data["choice_id"])
            db.session.add(vote)
            db.session.commit()
            return jsonify(f"Vote has been casted successfully"), 200
        return jsonify({"error": "Invalid choice and poll combination"}), 400
    except Exception as e:
        return jsonify({"error":str(e)}), 500

@api_blueprint.route("/poll/vote", methods=["GET"])
@jwt_required()
def vote_poll():
    poll_id = get_jwt_identity()
    claims = get_jwt()
    pollee_id = claims.get('pollee_id', None)
    if not poll_id or not pollee_id:
        return jsonify({"error": "Invalid token"}), 401
    try:
        verify_jwt_in_request()
    except ExpiredSignatureError:
        return jsonify({"error": "This poll has closed"}), 401
    try:
        assignment = PollAssignment.query.filter_by(poll_id=poll_id,pollee_id=pollee_id).first()
        if not assignment:
            return jsonify({"error": "You do not have permission to vote"}), 409
        poll = Poll.query.get(poll_id)
        if poll.status != 'active':
            return jsonify({"error": "This poll has closed"}), 400
        return jsonify(poll.pollee_view()), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 500


@api_blueprint.route("/poll/results/<int:id>", methods=["GET"])
@jwt_required()
def get_poll_results(id):
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify({"error": "User not found"}), 404
    try:
        votes = db.session.query(Vote.choice_id, Choice.name, Choice.description, func.count(Vote.id)).join(Choice, Vote.choice_id == Choice.id).filter(Vote.poll_id == id).group_by(Vote.choice_id, Choice.name, Choice.description).all()
        result = [{"choice_id":choice_id, "name":name, "description":description, "count":count} for choice_id,name,description,count in votes]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 500

@api_blueprint.route("/list/create", methods=["POST"])
@jwt_required()
def create_list():
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify({"error": "User not found"}), 404
    try:
        data = request.json
        list_schema = ListSchema()
        list_data = list_schema.load(data)
    except ValidationError as e:
        return jsonify({"error": e.messages}), 400
    try:
        list_obj = List(name=list_data["name"], user_id=user_id)
        db.session.add(list_obj)
        db.session.commit()
        return jsonify(list_obj.serialize()),200
    except Exception as e:
        return jsonify({"error":str(e)}), 500

@api_blueprint.route("/list/update", methods=["PUT"])
@jwt_required()
def update_list():
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify({"error": "User not found"}), 404
    try:
        data = request.json
        list_schema = ListSchema()
        list_data = list_schema.load(data)
        id = list_data["id"]
    except ValidationError as e:
        return jsonify({"error": e.messages}), 400
    try:
        if not id:
            return jsonify({"error": "List not found"}), 404
        list_obj = List.query.filter_by(id=list_data["id"], user_id=user_id).first()
        if not list_obj:
            return jsonify({"error": "List not found"}), 404
        list_obj.name = list_data["name"]
        db.session.commit()
        return jsonify(list_obj.serialize()), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 500

@api_blueprint.route("/list/delete/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_list(id):
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify({"error": "User not found"}), 404
    try:
        list_obj = List.query.filter_by(id=id, user_id=user_id).first()
        if not list_obj:
            return jsonify({"error": "List not found"}), 404
        db.session.delete(list_obj)
        db.session.commit()
        return jsonify({"message":f"List has been deleted"}), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 500

@api_blueprint.route("/lists", methods=["GET"])
@jwt_required()
def get_lists():
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify({"error": "User not found"}), 404
    try:
        list_obj = List.query.filter_by(user_id=user_id).all()
        list_data = [elem.serialize() for elem in list_obj]
        return jsonify(list_data), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 500
