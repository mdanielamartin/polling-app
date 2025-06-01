from marshmallow import Schema, fields, validates, ValidationError
from marshmallow.validate import Length, Range



class UserSchema(Schema):
    email =  fields.Email(required=True, validate=Length(min=5, max=50))
    password = fields.Str(required=True, validate=Length(min=8, max=20))

class PollSchema(Schema):
    name = fields.Str(required=True, validate=Length(min=3, max=255))
    time_limit_days = fields.Int(required=True, validate=Range(min=1,max=30))
