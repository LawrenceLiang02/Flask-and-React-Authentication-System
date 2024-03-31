from os import abort
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import datetime
import uuid
import hashlib
import jwt
from functools import wraps
import re

from Roles import Roles
from LogType import LogType
from db_operations import dbOperations

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = 'Th1s1ss3cr3t'

db = dbOperations()

def token_required(*required_roles):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):

            token = None

            if 'x-access-tokens' in request.headers:
                token = request.headers['x-access-tokens']

            if not token:
                return jsonify({'message': 'a valid token is missing'})

            try:
                data = jwt.decode(token, app.config["SECRET_KEY"], algorithms="HS256")
                user, role =  db.getTokenValidationById(data.get('id'))

                if role not in required_roles:
                    return jsonify({'message': 'insufficient permissions'}), 403
                
                if user != data.get('username'):
                    return jsonify({'message': 'token is invalid'}), 401
                
                expiration_time = data.get('exp')
                if int(datetime.datetime.utcnow().timestamp()) > expiration_time:
                    return jsonify({'message': 'Token has expired'}), 401

            except Exception as ex:
                return jsonify({'message': str(ex)}), 400

            return f(user, role, *args, **kwargs)

        return wrapper
    return decorator

@app.route('/users', methods=['GET', 'POST'])
@token_required(Roles.ADMIN.value, Roles.PREP_AFFAIRE.value, Roles.PREP_RESIDENTIEL.value)
def getAllUsers(user, role):
    try:
        user_role = request.json["user_role"]
        param = ""
        if "ADMIN" in user_role:       
            param = "ADMIN"
        elif "AFFAIRE" in user_role:
            param = "AFFAIRE"
        elif "RESIDENTIEL" in user_role:
            param = "RESIDENTIEL"
        else:
            print("It don't make sense")

        users = db.getUsers(param)

    except Exception as ex:
        return jsonify({'error': str(ex)}), 400
    
    return jsonify(users),200


@app.route('/signup', methods=['POST'])
def signup():
    try:
        username = request.json["username"]
        password = request.json["password"]
        user_role = request.json["user_role"]

        if db.userExists(username):
            return jsonify({'error': 'username already taken'}), 400

        isPwValid = is_valid_password(password)
        if (isPwValid != True):
            return jsonify({'error': isPwValid}), 400

        salt = generate_salt()
        hashed_password = hash_password(password, salt)

        password_expiration = int((datetime.datetime.utcnow() + datetime.timedelta(minutes=30)).timestamp())

        db.createUser(username, hashed_password, user_role, salt, password_expiration)
        
        return jsonify({
            "message": "signup successful"
        }), 200
    except Exception as ex:
        return jsonify({'error': str(ex)}), 400


@app.route('/login', methods=['GET', 'POST'])
def login():
    try:
        auth = request.authorization
        if not auth or not auth.username or not auth.password:
            return make_response('could not verify', 401, {'WWW.Authentication': 'Basic realm: "login required"'})

        result = db.getLoginValidation(auth.username)

        if result:
            user_id, user_role, username, salt, user_password = result
            hashed_password = hash_password(auth.password, salt)

            if hashed_password != user_password:
                db.createLog(event_type=LogType.FAILURE.value, event_time=datetime.datetime.utcnow().timestamp(), user_id=user_id)
                return jsonify({'error': 'Wrong password'}), 401
            
            token = jwt.encode({'id': user_id, 'username': auth.username,'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config["SECRET_KEY"], algorithm="HS256")
            db.createLog(event_type=LogType.SUCCESS.value, event_time=datetime.datetime.utcnow().timestamp(), user_id=user_id)
        else:
            return jsonify({'error': 'User not found'}), 401
        return jsonify({ 'user_role': user_role, 'token': token, 'username':username})
    
    except Exception as e:
        db.createLog(event_type=LogType.FAILURE.value, event_time=datetime.datetime.utcnow().timestamp(), user_id=user_id)
        return jsonify({'error': str(e)}), 400


@app.route('/getUser', methods=['GET'])
@token_required(Roles.ADMIN.value)
def getUser(user, role):
    return str("test")


@app.route('/validatetoken', methods=['POST'])
@token_required(Roles.ADMIN.value, Roles.PREP_AFFAIRE.value, Roles.PREP_RESIDENTIEL.value, Roles.CLIENT_RESIDENTIEL.value, Roles.CLIENT_AFFAIRE.value,)
def validateToken(user, role):
    return jsonify({'message': 'token valid'}), 200


@app.route('/getLogs', methods=['GET'])
@token_required(Roles.ADMIN.value,)
def getLogs(user, role):
    return jsonify(db.getLogs()), 200


@app.route('/updatePassword', methods=['POST'])
@token_required(Roles.ADMIN.value, Roles.PREP_AFFAIRE.value, Roles.PREP_RESIDENTIEL.value, Roles.CLIENT_RESIDENTIEL.value, Roles.CLIENT_AFFAIRE.value,)
def updatePassword(user, role):
    try:
        oldPassword = request.json["oldPassword"]
        newPassword = request.json["newPassword"]
        
        user_id, getOldPasword, salt = db.validateOldPassword(user)
        if hash_password(oldPassword, salt) != getOldPasword:
            return jsonify({'error': 'Wrong password'}), 401

        isPwValid = is_valid_password(newPassword)
        if (isPwValid != True):
            return jsonify({'error': isPwValid}), 401

        salt = generate_salt()
        hashed_password = hash_password(newPassword, salt)

        password_expiration = int((datetime.datetime.utcnow() + datetime.timedelta(minutes=30)).timestamp())

        db.updatePassword(user, hashed_password, salt, password_expiration)
        db.createLog(event_type=LogType.PASSWORD_CHANGE.value, event_time=datetime.datetime.utcnow().timestamp(), user_id=user_id)
    except Exception as ex:
        return jsonify({'error': str(ex)}), 400
    return jsonify({'message': 'password udpated'}), 200


@app.route('/updatePasswordAsAdmin', methods=['POST'])
@token_required(Roles.ADMIN.value,)
def updatePasswordAsAdmin(user, role):
    try:
        usernameJSON = request.json["username"]
        newPassword = request.json["newPassword"]

        user_id, username, user_role = db.getUserByUsername(usernameJSON)

        isPwValid = is_valid_password(newPassword)
        if (isPwValid != True):
            return jsonify({'error': isPwValid}), 401

        salt = generate_salt()
        hashed_password = hash_password(newPassword, salt)

        password_expiration = int((datetime.datetime.utcnow() + datetime.timedelta(minutes=30)).timestamp())

        db.updatePassword(usernameJSON, hashed_password, salt, password_expiration)
        db.createLog(event_type=LogType.PASSWORD_CHANGE.value, event_time=datetime.datetime.utcnow().timestamp(), user_id=user_id)
    except Exception as ex:
        return jsonify({'error': str(ex)}), 400
    return jsonify({'message': 'password udpated'}), 200


def is_valid_password(password):
    lowercase_letter_regex = re.compile(r'[a-z]')
    if not lowercase_letter_regex.search(password):
        return "Password is missing a lowercase letter"

    capital_letter_regex = re.compile(r'[A-Z]')
    if not capital_letter_regex.search(password):
        return "Password is missing a capital letter"

    number_regex = re.compile(r'\d')
    if not number_regex.search(password):
        return "Password is missing a number"

    special_character_regex = re.compile(r'[$%#@!&]')
    if not special_character_regex.search(password):
        return "Password is missing a special character"
    
    if not 8 <= len(password) <= 16:
        return "Password is not between 8 and 16 characters"

    return True


def generate_salt():
    return uuid.uuid4().hex

def hash_password(password, salt, iterations=1000):
    hashed_password = hashlib.sha256(password.encode('utf-8') + salt.encode('utf-8')).hexdigest()
    for _ in range(iterations - 1):
        hashed_password = hashlib.sha256(hashed_password.encode('utf-8') + salt.encode('utf-8')).hexdigest()
    return hashed_password


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
