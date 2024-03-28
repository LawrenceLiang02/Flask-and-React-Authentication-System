from os import abort
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import datetime
import uuid
import hashlib
import jwt
from functools import wraps

from Roles import Roles
from db_operations import dbOperations

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = 'Th1s1ss3cr3t'

db = dbOperations()

def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):

        token = None

        if 'x-access-tokens' in request.headers:
            token = request.headers['x-access-tokens']

        if not token:
            return jsonify({'message': 'a valid token is missing'})

        try:
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms="HS256")
            user, =  db.getUserById(data.get('id'))

            if user != data.get('username'):
                return jsonify({'message': 'token is invalid'}), 401
            
            expiration_time = data.get('exp')

            if int(datetime.datetime.utcnow().timestamp()) > expiration_time:
                return jsonify({'message': 'Token has expired'}), 401

        except Exception as ex:
            return jsonify({'message': str(ex)}), 400

        return f(user, *args, **kwargs)

    return decorator


@app.route('/users', methods=['GET'])
def getAllUsers():
    return jsonify(db.getUsers())


@app.route('/signup', methods=['POST'])
def signup():
    try:
        username = request.json["username"]
        password = request.json["password"]
        role = Roles.CLIENT

        salt = generate_salt()
        hashed_password = hash_password(password, salt)

        password_expiration = int((datetime.datetime.utcnow() + datetime.timedelta(minutes=30)).timestamp())

        db.createUser(username, hashed_password, role.value, salt, password_expiration)
        
        return jsonify({
            "message": "Signup successful"
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
            user_id, salt, user_password = result
            hashed_password = hash_password(auth.password, salt)

            if hashed_password != user_password:
                return jsonify({'error': 'Wrong password'}), 401
            
            token = jwt.encode({'id': user_id, 'username': auth.username,'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config["SECRET_KEY"], algorithm="HS256")

        return jsonify({'token': token})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/getUser', methods=['GET'])
@token_required
def getUser(user):
    return str(user)


def updatePermissions():
    return ""


def getClients():
    return ""


def updatePassword():
    return ""


def generate_salt():
    return uuid.uuid4().hex

def hash_password(password, salt, iterations=1000):
    hashed_password = hashlib.sha256(password.encode('utf-8') + salt.encode('utf-8')).hexdigest()
    for _ in range(iterations - 1):
        hashed_password = hashlib.sha256(hashed_password.encode('utf-8') + salt.encode('utf-8')).hexdigest()
    return hashed_password


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
