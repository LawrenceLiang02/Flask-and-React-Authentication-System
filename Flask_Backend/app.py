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

token_expiration_time = 30

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

                if data.get('user_role') != Roles.TEMPORARY.value:
                    if role not in required_roles :
                        return jsonify({'message': 'insufficient permissions'}), 403
                    
                    if user != data.get('username'):
                        return jsonify({'message': 'token is invalid'}), 401
                    
                    expiration_time = data.get('exp')
                    if int(datetime.datetime.utcnow().timestamp()) > expiration_time:
                        return jsonify({'message': 'Token has expired'}), 401
                    
                elif data.get('user_role') not in required_roles:
                    return jsonify({'message': 'insufficient permissions'}), 403
                
            except Exception as ex:
                return jsonify({'message': str(ex)}), 400

            return f(user, role, *args, **kwargs)

        return wrapper
    return decorator


## API pour get users
## Prend les parametres JSON indiqué ci-dessous
## Retourne les users
@app.route('/users', methods=['GET', 'POST'])
@token_required(Roles.SUPER_ADMIN.value, Roles.ADMIN.value, Roles.PREP_AFFAIRE.value, Roles.PREP_RESIDENTIEL.value)
def getAllUsers(user, role):
    try:
        user_role = request.json["user_role"]
        param = ""

        if role == user_role:
            if "SUPER_ADMIN" in user_role:       
                param = "SUPER_ADMIN"
            elif "ADMIN" in user_role:       
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


## API pour signup
## Prend les parametres JSON indiqué ci-dessous
## Retourne le statut
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

        pw_creation = int((datetime.datetime.utcnow()).timestamp())

        db.createUser(username, hashed_password, user_role, salt, pw_creation)
        
        return jsonify({
            "message": "signup successful"
        }), 200
    except Exception as ex:
        return jsonify({'error': str(ex)}), 400


## API pour login
## Prend les parametres dans l'entête, prend un username et password
## Retourne le token, role, et username en JSON
@app.route('/login', methods=['GET', 'POST'])
def login():
    try:
        auth = request.authorization
        if not auth or not auth.username or not auth.password:
            return make_response('could not verify', 401, {'WWW.Authentication': 'Basic realm: "login required"'})

        result = db.getLoginValidation(auth.username)
        password_expiration_time, nb_tentative, tentative_intervale = db.getLoginConfig()

        if result:
            user_id, user_role, username, salt, user_password, failed_login_attempts, next_login_time, password_creation = result
            hashed_password = hash_password(auth.password, salt)

            if failed_login_attempts is not None and failed_login_attempts > nb_tentative:
                return jsonify({'error': 'Too many failed attempts, please contact an Admin to reset your password'}), 401

            if next_login_time is not None and datetime.datetime.utcnow().timestamp() < next_login_time:
                return jsonify({'error': 'Due to failed attempt, you can not login for ' + str(round(next_login_time - datetime.datetime.utcnow().timestamp())) + " seconds."}), 401

            if hashed_password != user_password:
                db.createLog(event_type=LogType.FAILURE.value, event_time=datetime.datetime.utcnow().timestamp(), user_id=user_id)
                next_login_time = (datetime.datetime.utcnow() + datetime.timedelta(minutes=tentative_intervale)).timestamp()
                db.updateLoginFail(username, failed_login_attempts + 1, next_login_time)
                return jsonify({'error': 'Wrong password'}), 401
            
            password_expiration = (datetime.datetime.fromtimestamp(password_creation) + datetime.timedelta(minutes=password_expiration_time)).timestamp()
            if password_creation is not None and datetime.datetime.utcnow().timestamp() > password_expiration:
                token = jwt.encode({'id': user_id, 'username': auth.username, 'user_role': Roles.TEMPORARY.value,'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=token_expiration_time)}, app.config["SECRET_KEY"], algorithm="HS256")
                return jsonify({'error': 'The password has expired, please reset the password.', 'username': username, 'user_role':user_role, 'token':token}), 403
            
            db.updateLoginFail(username, 0, None)
            token = jwt.encode({'id': user_id, 'username': auth.username, 'user_role': user_role,'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=token_expiration_time)}, app.config["SECRET_KEY"], algorithm="HS256")
            db.createLog(event_type=LogType.SUCCESS.value, event_time=datetime.datetime.utcnow().timestamp(), user_id=user_id)
        else:
            return jsonify({'error': 'User not found'}), 401
        return jsonify({ 'user_role': user_role, 'token': token, 'username':username})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400


## API pour get user
## Retourne le statut
# @app.route('/getUser', methods=['GET'])
# @token_required(Roles.SUPER_ADMIN.value, Roles.ADMIN.value)
# def getUser(user, role):
#     return str("test")


## API pour validate token
## Retourne le statut
# @app.route('/validatetoken', methods=['POST'])
# @token_required(Roles.SUPER_ADMIN.value, Roles.ADMIN.value, Roles.PREP_AFFAIRE.value, Roles.PREP_RESIDENTIEL.value, Roles.CLIENT_RESIDENTIEL.value, Roles.CLIENT_AFFAIRE.value,)
# def validateToken(user, role):
#     return jsonify({'message': 'token valid'}), 200


## API pour getLogs
## Retourne les logs
@app.route('/getLogs', methods=['GET'])
@token_required(Roles.SUPER_ADMIN.value, Roles.ADMIN.value)
def getLogs(user, role):
    return jsonify(db.getLogs()), 200


## API pour update role
## Prend les parametres JSON username et new_role
## Retourne le statut
@app.route('/updateRole', methods=['POST'])
@token_required(Roles.SUPER_ADMIN.value, Roles.ADMIN.value,)
def updateRole(user, role):
    try:
        usernameJSON = request.json["username"]
        newRole = request.json["new_role"]

        print(newRole)
        print(Roles.PREP_AFFAIRE.value)
        
        if (newRole == Roles.ADMIN.value and role != Roles.ADMIN.value):
            return jsonify({'error': "You can't change this to an admin. In fact, nobody can."}), 401
        
        if (newRole != Roles.ADMIN.value and newRole != Roles.PREP_AFFAIRE.value and newRole != Roles.PREP_RESIDENTIEL.value and newRole != Roles.CLIENT_AFFAIRE.value and newRole != Roles.CLIENT_RESIDENTIEL.value):
            return jsonify({'error': "Role Invalide."}), 401

        user_id, user_role, username, oldPassword, salt = db.getUserByUsername(usernameJSON)

        if (newRole == user_role):
            return jsonify({'error': "C'est deja ce role"}), 401

        db.updateRole(username, newRole)
        db.createLog(event_type=LogType.ROLE_CHANGE.value, event_time=datetime.datetime.utcnow().timestamp(), user_id=user_id)
    except Exception as ex:
        return jsonify({'error': str(ex)}), 400
    return jsonify({'message': 'role updated'}), 200


## API pour update password
## Prend les parametres JSON oldPassword et newPassword
## Retourne le statut
@app.route('/updatePassword', methods=['POST'])
@token_required(Roles.SUPER_ADMIN.value, Roles.ADMIN.value, Roles.PREP_AFFAIRE.value, Roles.PREP_RESIDENTIEL.value, Roles.CLIENT_RESIDENTIEL.value, Roles.CLIENT_AFFAIRE.value, Roles.TEMPORARY.value,)
def updatePassword(user, role):
    try:
        oldPassword = request.json["oldPassword"]
        newPassword = request.json["newPassword"]
        
        user_id, getOldPasword, oldSalt = db.validateOldPassword(user)
        if hash_password(oldPassword, oldSalt) != getOldPasword:
            return jsonify({'error': 'Wrong password'}), 401

        isPwValid = is_valid_password(newPassword)
        if (isPwValid != True):
            return jsonify({'error': isPwValid}), 401
        
        old_passwords_list = db.getOldPasswords(user_id)[::-1]
        nb_reusable_pw, = db.getNumberUnreusablePassword()

        nb_pw_count = 0

        if old_passwords_list != None:
            for password_entry in old_passwords_list:
                nb_pw_count += 1
                if nb_pw_count <= nb_reusable_pw:
                    temp_salt, temp_passowrd = password_entry
                    if (temp_passowrd == hash_password(newPassword, temp_salt)):
                        return jsonify({'error': 'Cant reuse last ' + str(nb_reusable_pw) + ' passwords'}), 401

        salt = generate_salt()
        hashed_password = hash_password(newPassword, salt)

        pw_creation = int((datetime.datetime.utcnow()).timestamp())

        db.updatePassword(user, hashed_password, salt, pw_creation)
        db.createOldPassword(user_id, getOldPasword, oldSalt)
        db.createLog(event_type=LogType.PASSWORD_CHANGE.value, event_time=datetime.datetime.utcnow().timestamp(), user_id=user_id)
    except Exception as ex:
        return jsonify({'error': str(ex)}), 400
    return jsonify({'message': 'password udpated'}), 200


## API pour update password as admin
## Prend les parametres JSON username et newPassword
## Retourne le statut
@app.route('/updatePasswordAsAdmin', methods=['POST'])
@token_required(Roles.SUPER_ADMIN.value, Roles.ADMIN.value,)
def updatePasswordAsAdmin(user, role):
    try:
        usernameJSON = request.json["username"]
        newPassword = request.json["newPassword"]

        user_id, username, user_role, oldPassword, oldSalt = db.getUserByUsername(usernameJSON)

        isPwValid = is_valid_password(newPassword)
        if (isPwValid != True):
            return jsonify({'error': isPwValid}), 401
        
        old_passwords_list = db.getOldPasswords(user_id)[::-1]
        nb_reusable_pw, = db.getNumberUnreusablePassword()

        nb_pw_count = 0

        if old_passwords_list != None:
            for password_entry in old_passwords_list:
                nb_pw_count += 1
                if nb_pw_count <= nb_reusable_pw:
                    temp_salt, temp_passowrd = password_entry
                    if (temp_passowrd == hash_password(newPassword, temp_salt)):
                        return jsonify({'error': 'Cant reuse last ' + str(nb_reusable_pw) + ' passwords'}), 401

        salt = generate_salt()
        hashed_password = hash_password(newPassword, salt)

        pw_creation = int((datetime.datetime.utcnow()).timestamp())

        db.updatePassword(usernameJSON, hashed_password, salt, pw_creation)
        db.createOldPassword(user_id, oldPassword, oldSalt)
        db.createLog(event_type=LogType.PASSWORD_CHANGE.value, event_time=datetime.datetime.utcnow().timestamp(), user_id=user_id)
    except Exception as ex:
        return jsonify({'error': str(ex)}), 400
    return jsonify({'message': 'password udpated'}), 200


## API pour update password config
## Prend les parametres JSON indiqué ci-dessous
## Retourne le statut
@app.route('/updatePasswordConfig', methods=['POST'])
@token_required(Roles.SUPER_ADMIN.value, Roles.ADMIN.value)
def updatePasswordConfig(user, role):
    try:
        min_length = request.json["min_length"]
        max_length = request.json["max_length"]
        require_lowercase = request.json["require_lowercase"]
        require_uppercase = request.json["require_uppercase"]
        require_numbers = request.json["require_numbers"]
        require_special_chars = request.json["require_special_chars"]
        password_expiration_time = request.json["password_expiration_time"]
        nb_tentative = request.json["nb_tentative"]
        tentative_intervale = request.json["tentative_intervale"]
        nb_mdp_ancien = request.json["nb_mdp_ancien"]
        
        db.updatePasswordConfig(min_length, max_length, require_lowercase, require_uppercase, require_numbers, require_special_chars, password_expiration_time, tentative_intervale, nb_tentative, nb_mdp_ancien )

        return jsonify({'message': 'Password configuration updated successfully'}), 200
    except Exception as ex:
        return jsonify({'error': str(ex)}), 400


## API pour get password config
## Retourne les password configs
@app.route('/getPasswordConfig', methods=['GET'])
@token_required(Roles.SUPER_ADMIN.value, Roles.ADMIN.value)
def getPasswordConfig(user, role):
    try:
        config = db.getPasswordConfigurationJSON()
        return jsonify(config),200
    except Exception as ex:
        return jsonify({'error': str(ex)}), 400


## Fonction de validation de mot de passe
## Prend un password
## Retourne une erreur ou TRUE si cest valide.
def is_valid_password(password):
    min_length, max_length, require_lowercase, require_uppercase, require_numbers, require_special_chars = db.getPasswordConfiguration()
    
    if ' ' in password:
        return "Password cannot contain spaces"

    if require_lowercase and not re.search(r'[a-z]', password):
        return "Password is missing a lowercase letter"

    if require_uppercase and not re.search(r'[A-Z]', password):
        return "Password is missing a capital letter"

    if require_numbers and not re.search(r'\d', password):
        return "Password is missing a number"

    if require_special_chars and not re.search(r'[$%#@!&]', password):
        return "Password is missing a special character"
    
    if len(password) < min_length or len(password) > max_length:
        return "Password must be between " + str(min_length) + " and " + str(max_length) + " characters"

    return True

## Utilise la librairie uuid pour générer un uuid random
def generate_salt():
    return uuid.uuid4().hex

## Fonction pour haché le mot de passe avc le hashlib librairie, prend un password, salt, et un nombre d'itération.
## Retourne le mot de passe haché
def hash_password(password, salt, iterations=1000):
    hashed_password = hashlib.sha256(password.encode('utf-8') + salt.encode('utf-8')).hexdigest()
    for _ in range(iterations - 1):
        hashed_password = hashlib.sha256(hashed_password.encode('utf-8') + salt.encode('utf-8')).hexdigest()
    return hashed_password


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', ssl_context=('cert.pem', 'key.pem'))
