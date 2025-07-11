from .models import User
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from datetime import timedelta, datetime, timezone
from mailjet_rest import Client
from dotenv import load_dotenv
import os
from pytz import timezone as tz
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

def send_token_email(email,token, expiration_date,timezone, poll_name):
    poll_link = f'{FRONTEND_URL}/verify/{token}'
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
              "Name":"Test Polling App"
            }
          ],
          "Subject": "Polling Invitation Link",
          "TextPart": f"You have been invited to complete a poll, please click on the following link to cast your vote:",
          "HTMLPart": f"""
<div style="font-family: Arial, sans-serif; line-height: 1.6;">
  <h2 style="color: #333;">{poll_name}</h2>
  <p>You’ve been invited to participate in a poll. Please click the link below to cast your vote:</p>
  <p><a href="{poll_link}" style="color: #007BFF; text-decoration: none;">Launch Poll</a></p>
  <p><strong>Closing time:</strong> {expiration_date.strftime("%a, %d %b %Y %H:%M:%S")} ({timezone})</p>
  <p>Make sure to cast your vote before the deadline to ensure it’s counted.</p>
  <hr>
  <p style="font-size: 0.9em; color: #666;">If you weren’t expecting this invitation, feel free to ignore this message.</p>
</div>
"""


        }
      ]
    }
    result = mailjet.send.create(data=data)
    if result.status_code not in [200,201]:
        return (email)
    return  ("")

def generate_url(pollee_id,poll_id,closing_date,publish_date):
    expiration_time = closing_date - publish_date
    access_token = create_access_token(identity=str(poll_id),additional_claims={"pollee_id": pollee_id}, expires_delta=expiration_time)
    return access_token
