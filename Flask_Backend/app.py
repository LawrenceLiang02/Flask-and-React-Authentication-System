from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import mysql.connector
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import jwt
from functools import wraps
from Roles import Roles

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = 'Th1s1ss3cr3t'

connection = mysql.connector.connect(user='root', password='password', host='mysql', port="3306", database='lab5db')
print("DB connected")

@app.route('/api', methods=['GET'])
def index():
    return{
        "channel":"The Show",
        "tutorial":"Test Test"
    }


@app.route('/users', methods=['GET'])
def getUsers():
    return select_all_from_db()


def login():
    return "login"


# # Register/Login
class User:
    def __init__(self, public_id, name, password, admin):
        self.public_id = public_id
        self.name = name
        self.password = password
        self.admin = admin

    id = 0
    public_id = 0
    name = ""
    password = ""
    admin = False

users = {}

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

            current_user = None

            for u in users.values():
                #if u.public_id == data['public_id']:
                current_user = u

            # users.query.filter_by(public_id=data['public_id']).first()

        except Exception as ex:

            # return jsonify({'message': 'token is invalid', 'exception': ex})
            return jsonify({'message': 'token is invalid'})

        return f("uname", *args, **kwargs)

    return decorator


def select_all_from_db():
    mycursor = connection.cursor()
    mycursor.execute("SELECT * FROM users;")
    row_headers=[x[0] for x in mycursor.description]
    data = mycursor.fetchall()
    # connection.close()
    json_data = []
    for x in data:
        json_data.append(dict(zip(row_headers,x)))
    return json_data


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
    # app.run(debug=True)
    # app.run(debug=True, host='0.0.0.0')
