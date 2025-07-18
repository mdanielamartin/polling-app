from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity, get_jwt, verify_jwt_in_request
from jwt.exceptions import ExpiredSignatureError
import bcrypt
from .models import db, User, Poll, Choice, Pollee, PollAssignment, Vote, List, list_member
from marshmallow import ValidationError
from .validation import UserSchema, PollSchema, ChoiceSchema, PolleeSchema, PollAssignmentSchema, VoteSchema, ListSchema
from .utils import check_user, generate_url, send_token_email
from datetime import timedelta, datetime
from pytz import timezone, utc
from sqlalchemy import func

api_blueprint = Blueprint("api", __name__)

@api_blueprint.route("/user/register", methods=["POST"])
def add_user():
    data = request.json
    user_schema = UserSchema()
    try:
        validated_data = user_schema.load(data)
        if User.query.filter_by(email=validated_data['email']).first():
            return jsonify("Email already in use"), 409
    except ValidationError as e:
        return jsonify({e.messages}), 400
    try:
        hashed_password = bcrypt.hashpw(validated_data['password'].encode('utf-8'), bcrypt.gensalt())
        new_user = User(email=validated_data['email'], password=hashed_password.decode('utf-8'))
        db.session.add(new_user)
        db.session.commit()
        return jsonify("User added successfully!"), 201
    except Exception as e:
        return jsonify({str(e)}), 500

@api_blueprint.route("/user/login", methods=["POST"])
def login_user():
    data = request.json
    user_schema = UserSchema()
    try:
        validated_data = user_schema.load(data)
        if not User.query.filter_by(email=validated_data['email']).first():
            return jsonify("Account not found, registration required"), 404
    except ValidationError as e:
        return jsonify({e.messages}), 400
    try:
        user = User.query.filter_by(email=validated_data['email']).first()
        verify_password = bcrypt.checkpw(validated_data['password'].encode('utf-8'), user.password.encode('utf-8'))
        if not verify_password:
            return jsonify("Invalid email/password combination"), 401
        access_token = create_access_token(identity=str(user.id),additional_claims={"email": user.email}, expires_delta=timedelta(hours=1))
        return jsonify({"access_token": access_token}), 200
    except Exception as e:
        return jsonify(str(e)), 500

@api_blueprint.route("/poll/create", methods=["POST"])
@jwt_required()
def create_poll():
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify("User not found"), 404
    try:
        data = request.json
        poll_schema = PollSchema()
        validated_data = poll_schema.load(data)
    except ValidationError as e:
        return jsonify(e.messages), 400
    try:
        poll = Poll(name=validated_data["name"],time_limit_days=validated_data["time_limit_days"],user_id=user_id)
        db.session.add(poll)
        db.session.commit()
        return jsonify(poll.serialize()), 200
    except Exception as e:
        return jsonify(str(e)), 500


@api_blueprint.route("/polls", methods=["GET"])
@jwt_required()
def get_polls():
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify("User not found"), 404
    try:
        polls = Poll.query.filter_by(user_id=user_id).all()
        poll_list = [poll.serialize() for poll in polls]
        return jsonify(poll_list), 200
    except Exception as e:
        return jsonify(str(e)), 500

@api_blueprint.route("/poll/update/<int:id>", methods=["PUT"])
@jwt_required()
def update_poll(id):
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify("User not found"), 404
    try:
        data = request.json
        poll_schema = PollSchema()
        validated_data = poll_schema.load(data)
    except ValidationError as e:
        return jsonify(e.messages), 400
    try:
        poll = Poll.query.filter_by(id=id,user_id=user_id).first()
        if not poll:
            return jsonify("Poll not found"), 404
        for key,value in validated_data.items():
            if hasattr(poll,key):
                setattr(poll,key,value)
        db.session.commit()
        return jsonify(poll.serialize()), 200
    except Exception as e:
        return jsonify(str(e)), 500

@api_blueprint.route("/poll/delete/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_poll(id):
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify("User not found"), 404
    try:
        poll = Poll.query.filter_by(id=id,user_id=user_id).first()
        if not poll:
            return jsonify("Poll not found"), 404
        if poll.status == "draft" or poll.status == "completed":
            db.session.delete(poll)
            db.session.commit()
            return jsonify({"message":f"Poll {id} deleted"}), 200
        return jsonify("Only drafted or completed polls can be deleted"), 400
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
        return jsonify("User not found"), 404
    try:
        poll = Poll.query.filter_by(user_id=user_id, id=id).first()
        if not poll:
            return jsonify("Poll not found"), 404
        poll_data = poll.serialize()
        poll_data["choices"] = [choice.serialize() for choice in poll.choices]
        return jsonify(poll_data), 200
    except Exception as e:
        return jsonify(str(e)), 500


@api_blueprint.route("/pollee/add", methods=["POST"])
@jwt_required()
def add_pollee():
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify("User not found"), 404
    try:
        data = request.json
        pollee_schema = PolleeSchema()
        validated_data = pollee_schema.load(data)
    except ValidationError as e:
        return jsonify(e.messages), 400
    try:
        check_email = Pollee.query.filter_by(email = validated_data["email"], user_id=user_id).first()
        if check_email:
            return jsonify("Duplicated contact"), 400
        pollee = Pollee(user_id=user_id, email = validated_data["email"])
        db.session.add(pollee)
        db.session.commit()
        return jsonify(pollee.serialize()), 200
    except Exception as e:
        return jsonify(str(e)), 500

@api_blueprint.route("/pollee/delete", methods=["DELETE"])
@jwt_required()
def delete_pollee():
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify("User not found"), 404
    try:
        data = request.get_json()
        if not isinstance(data, list) or not all(isinstance(id, int) for id in data):
            return jsonify("Expected a list of integers (IDs)"), 400

        deleted_ids = []
        not_found_ids = []

        for id in data:
            pollee = Pollee.query.filter_by(id=id, user_id=user_id).first()
            if pollee:
                db.session.delete(pollee)
                deleted_ids.append(id)
            else:
                not_found_ids.append(id)

        db.session.commit()

        return jsonify({
            "message": "Deletion attempt completed",
            "deleted_ids": deleted_ids,
            "not_found_ids": not_found_ids
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
        return jsonify(pollee.serialize()), 200
    except Exception as e:
        return jsonify(str(e)), 500

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
        return jsonify("User not found"), 404

    try:
        data = request.get_json()
        if not isinstance(data, list) or not all(isinstance(id, int) for id in data):
            return jsonify("Expected a list of IDs"), 400

        poll = Poll.query.get(poll_id)
        if not poll or str(poll.user_id) != user_id:
            return jsonify("Unauthorized access"), 401

        added = []
        skipped = []

        for id in data:
            exists = PollAssignment.query.filter_by(poll_id=poll_id, pollee_id=id).first()
            if exists:
                skipped.append(exists.serialize())
                continue
            assignment = PollAssignment(poll_id=poll_id, pollee_id=id)
            db.session.add(assignment)
            db.session.flush()
            db.session.refresh(assignment)
            added.append(assignment.serialize())

        db.session.commit()
        return jsonify({
            "message": "Assignment process completed",
            "assigned": added,
            "skipped": skipped
        }), 200

    except Exception as e:
        return jsonify(str(e)), 500

@api_blueprint.route("/pollee/assignment/<int:poll_id>", methods=["DELETE"])
@jwt_required()
def delete_assignments(poll_id):
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify("User not found"), 404

    try:
        data = request.get_json()
        if not isinstance(data, list) or not all(isinstance(id, int) for id in data):
            return jsonify("Expected a list of IDs"), 400

        deleted_ids = []
        not_found_ids = []

        for id in data:
            assignment = PollAssignment.query.filter_by(id=id, poll_id=poll_id).first()
            if assignment:
                db.session.delete(assignment)
                deleted_ids.append(id)
            else:
                not_found_ids.append(id)

        db.session.commit()

        return jsonify({
            "message": "Deletion attempt completed",
            "deleted_ids": deleted_ids,
            "not_found_ids": not_found_ids
        }), 200

    except Exception as e:
        return jsonify(str(e)), 500

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
    data = request.json
    if not auth:
        return jsonify("User not found"), 404
    try:
        poll = Poll.query.filter_by(id=id, user_id=user_id).first()
        if not poll:
            return jsonify("Poll not found"), 404

        publish_date_str = data.get("publish_date") #UTC DATE
        user_tz_str = data.get("user_timezone")

        if not publish_date_str or not user_tz_str:
            return jsonify("Mising date and/or timezone"), 400

        user_timezone = timezone(user_tz_str)#LOCAL TIMEZONE
        publish_date_utc = datetime.fromisoformat(publish_date_str.replace("Z", "+00:00"))#UTC AWARE
        local_publish_date = publish_date_utc.astimezone(user_timezone)#PUBLISH DATE IN LOCAL TIME
        local_closing_date =( local_publish_date + timedelta(days=poll.time_limit_days)).replace(hour=23, minute=59, second=59)#FOR EMAIL

        utc_publish_date = local_publish_date.astimezone(utc)
        utc_closing_date = local_closing_date.astimezone(utc)

        # if poll.status == 'active':
        #     return jsonify("This poll is already active"), 400

        poll.status = "active"
        poll.publish_date = utc_publish_date
        poll.closing_date = utc_closing_date
        poll.local_timezone = user_tz_str
        assignments = PollAssignment.query.filter_by(poll_id=id).all()
        if not assignments:
            return jsonify("Poll has not been assigned to a contact"), 400
        db.session.commit()
        fails = []
        for pollee in assignments:
            token = generate_url(pollee.pollee_id,id,utc_closing_date,utc_publish_date)
            send_result = send_token_email(pollee.pollee.email,token,local_closing_date,user_timezone,poll.name)
            if send_result:
                fails.append(send_result)
        if fails:
            return fails, 400
        return jsonify("All emails sent successfully"), 200
    except Exception as e:
        return jsonify(str(e)), 500

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
            vote = Vote(poll_id=poll_id, choice_id=validated_data["choice_id"])
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
        return jsonify("Invalid token"), 401
    try:
        verify_jwt_in_request()
    except ExpiredSignatureError:
        return jsonify("This poll has closed"), 401
    try:
        assignment = PollAssignment.query.filter_by(poll_id=poll_id,pollee_id=pollee_id).first()
        if not assignment:
            return jsonify("You do not have permission to vote"), 409
        poll = Poll.query.get(poll_id)
        if poll.status != 'active':
            return jsonify("This poll has closed"), 400
        return jsonify(poll.pollee_view()), 200
    except Exception as e:
        return jsonify(str(e)), 500



@api_blueprint.route("/poll/results/<int:id>", methods=["GET"])
@jwt_required()
def get_poll_results(id):
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify("User not found"), 404
    try:
        votes = db.session.query(Vote.choice_id, Choice.name, Choice.description, func.count(Vote.id)).join(Choice, Vote.choice_id == Choice.id).filter(Vote.poll_id == id).group_by(Vote.choice_id, Choice.name, Choice.description).all()
        result = [{"choice_id":choice_id, "label":name, "description":description, "value":count} for choice_id,name,description,count in votes]
        return jsonify(result), 200
    except Exception as e:
        return jsonify(str(e)), 500

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
        return jsonify("User not found"), 404
    try:
        list_obj = List.query.filter_by(id=id, user_id=user_id).first()
        if not list_obj:
            return jsonify("List not found"), 404
        db.session.delete(list_obj)
        db.session.commit()
        return jsonify("List has been deleted"), 200
    except Exception as e:
        return jsonify(str(e)), 500

@api_blueprint.route("/lists", methods=["GET"])
@jwt_required()
def get_lists():
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify("User not found"), 404
    try:
        list_obj = List.query.filter_by(user_id=user_id).all()
        list_data = [elem.serialize() for elem in list_obj]
        return jsonify(list_data), 200
    except Exception as e:
        return jsonify(str(e)), 500

@api_blueprint.route("/list/<int:list_id>/add/pollee", methods=["POST"])
@jwt_required()
def add_to_list(list_id):
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify({"error": "User not found"}), 404
    try:
        data = request.get_json()
        if not isinstance(data, list) or not all(isinstance(id, int) for id in data):
            return jsonify("Expected a list of IDs"), 400
        for pollee in data:
            record = db.session.query(list_member).filter_by(pollee_id=pollee,list_id=list_id).first()
            if not record:
                db.session.execute(list_member.insert().values(
                pollee_id=pollee,list_id=list_id))
        db.session.commit()
        updated_list = List.query.get(list_id)
        return jsonify(updated_list.serialize()), 200
    except Exception as e:
        return jsonify(str(e)), 500

@api_blueprint.route("/list/<int:list_id>/delete/pollee", methods=["DELETE"])
@jwt_required()
def delete_from_list(list_id):
    user_id = get_jwt_identity()
    auth = check_user(user_id)
    if not auth:
        return jsonify("User not found"), 404
    try:
        data = request.get_json()
        if not isinstance(data, list) or not all(isinstance(id, int) for id in data):
            return jsonify("Expected a list of IDs"), 400
        for id in data:
           db.session.execute(
            list_member.delete().where(
            list_member.c.pollee_id == id,
            list_member.c.list_id == list_id))
        db.session.commit()

        updated_list = List.query.get(list_id)
        return jsonify(updated_list.serialize()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
