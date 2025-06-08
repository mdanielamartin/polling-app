from marshmallow import Schema, fields, validates, ValidationError
from marshmallow.validate import Length, Range



class UserSchema(Schema):
    email =  fields.Email(required=True, validate=Length(min=5, max=50))
    password = fields.Str(required=True, validate=Length(min=8, max=20))

class PollSchema(Schema):
    name = fields.Str(required=True, validate=Length(min=3, max=50))
    description = fields.Str(required=False, validate=Length(min=1,max=255))
    time_limit_days = fields.Int(required=True, validate=Range(min=1,max=30))

class ChoiceSchema(Schema):
    id = fields.Integer(required=False)
    name = fields.Str(required=True, validate=Length(min=1,max=50))
    description = fields.Str(required=False, validate=Length(min=1,max=500))

class PolleeSchema(Schema):
    id = fields.Integer(required=False)
    email =  fields.Email(required=True, validate=Length(min=5, max=50))
    category_id = fields.Integer(required=False)

class PollAssignmentSchema(Schema):
    pollee_id = fields.Integer(required=True)

class VoteSchema(Schema):
    choice_id = fields.Integer(required=True)
