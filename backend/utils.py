from .models import User


def check_user(id):
    if not id:
        return False
    user = User.query.get(id)
    if not user:
        return False
    return True
