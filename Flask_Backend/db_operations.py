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
    

    def getUserById(self, id):
        mycursor = connection.cursor()
        sql = ("SELECT username FROM users WHERE user_id = %s;")
        val = (id,)
        mycursor.execute(sql, val)
        data = mycursor.fetchone()
        return data