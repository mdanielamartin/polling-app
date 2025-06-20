from .models import User
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from datetime import timedelta, datetime, timezone
from mailjet_rest import Client
from dotenv import load_dotenv
import os
load_dotenv()

FRONTEND_URL = os.getenv('FRONTEND_URL')
KEY = os.getenv('MAIL_KEY')
SECRET = os.getenv('MAIL_SECRET')

def check_user(id):
    if not id:
        return False
    user = User.query.get(id)
    if not user:
        return False
    return True

def send_token_email(email,token, expiration_date, name, pollee_id):
    poll_link = f'{FRONTEND_URL}/poll-invitation?token={token}'
    api_key = KEY
    api_secret = SECRET
    mailjet = Client(auth=(api_key, api_secret), version='v3.1')
    data = {
      'Messages': [
        {
          "From": {
            "Email": "mdaniela.martin@proton.me",
            "Name": "Polling App"
          },
          "To": [
            {
              "Email": email,
              "Name":email
            }
          ],
          "Subject": "Polling Invitation Link",
          "TextPart": f"You have been invited to complete a poll, please click on the following link to cast your vote: {poll_link}",
          "HTMLPart": f"<div><h1>{name}</h1><h3>You have been invited to complete a poll.</h3><p>Please use the following link to gain access and cast your vote: <a href='{poll_link}'>Launch Poll</a></p><p> The poll will remain active until {expiration_date.strftime("%B %d, %Y")}, closing at 11:59 pm. Remember to cast your vote before this date to ensure your participation.</p><p>If you are unfamiliar with this poll and you were not expecting an access link you can ignore this message.</p></div>"
        }
      ]
    }
    result = mailjet.send.create(data=data)
    if result.status_code not in [200,201]:
        return ({"pollee_id":pollee_id})
    return  ({"pollee_id":None})

def generate_url(pollee_id,poll_id,expiration_date):
    expiration_time = expiration_date - datetime.now(timezone.utc)
    access_token = create_access_token(identity=str(poll_id),additional_claims={"pollee_id": pollee_id}, expires_delta=expiration_time)
    return access_token
