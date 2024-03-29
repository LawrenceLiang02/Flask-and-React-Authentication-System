import mysql.connector

connection = mysql.connector.connect(user='root', password='password', host='mysql', port="3306", database='lab5db')

class dbOperations():
    
    def getUsers(self):
        mycursor = connection.cursor()
        mycursor.execute("SELECT * FROM users;")
        row_headers=[x[0] for x in mycursor.description]
        data = mycursor.fetchall()
        json_data = []
        for x in data:
            json_data.append(dict(zip(row_headers,x)))
        return json_data

    def createUser(self, username, password, role, salt, pwExpTimestamp):
        mycursor = connection.cursor()
        sql = "INSERT INTO users (username, user_password, user_role, salt, password_expiration_date) VALUES (%s , %s, %s, %s, %s);"
        val = (username, password, role, salt, pwExpTimestamp)
        mycursor.execute(sql, val)
        connection.commit()
    
    def getLoginValidation(self, username):
        mycursor = connection.cursor()
        sql = ("SELECT user_id, salt, user_password FROM users WHERE username = %s;")
        val = (username,)
        mycursor.execute(sql, val)
        data = mycursor.fetchone()
        return data

    def getTokenValidationById(self, id):
        mycursor = connection.cursor()
        sql = ("SELECT username, user_role FROM users WHERE user_id = %s;")
        val = (id,)
        mycursor.execute(sql, val)
        data = mycursor.fetchone()
        return data
    
    def userExists(self, username):
        mycursor = connection.cursor()
        sql = ("SELECT username FROM users WHERE username = %s;")
        val = (username,)
        mycursor.execute(sql, val)
        data = mycursor.fetchone()
        return data is not None
    
    def createLog(self, event_time, event_type, user_id):
        mycursor = connection.cursor()
        sql = "INSERT INTO security_log (event_time, event_type, user_id) VALUES (%s, %s, %s);"
        val = (event_time, event_type, user_id)
        mycursor.execute(sql, val)
        connection.commit()

    def getLogs(self):
        mycursor = connection.cursor()
        mycursor.execute("""
        SELECT sl.log_id, sl.event_time, sl.event_type, sl.user_id, u.username 
        FROM security_log sl 
        JOIN users u ON sl.user_id = u.user_id;
        """)
        row_headers=[x[0] for x in mycursor.description]
        data = mycursor.fetchall()
        json_data = []
        for x in data:
            json_data.append(dict(zip(row_headers,x)))
        return json_data
