from flask import Blueprint, jsonify

api_blueprint = Blueprint("server", __name__)

@api_blueprint.route("/polls", methods=["GET"])
def get_polls():
    return jsonify({"message": "Polls endpoint working and updating!"})

@api_blueprint.route("/auth", methods=["POST"])
def authenticate():
    return jsonify({"message": "Authentication endpoint!"})
