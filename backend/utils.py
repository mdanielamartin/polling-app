from .models import User
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from datetime import timedelta
def check_user(id):
    if not id:
        return False
    user = User.query.get(id)
    if not user:
        return False
    return True

def generate_url(pollee_id,email,poll_id,valid_days):
   access_token = create_access_token(identity=str(poll_id),additional_claims={"pollee_id": pollee_id}, expires_delta=timedelta(days=valid_days))
   return access_token
