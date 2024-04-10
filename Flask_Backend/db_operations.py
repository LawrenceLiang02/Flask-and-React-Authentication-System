import mysql.connector

connection = mysql.connector.connect(user='root', password='password', host='mysql', port="3306", database='lab5db')

class dbOperations():
    
    def getUsers(self, param):
        mycursor = connection.cursor(buffered=False)
        if param == "ADMIN":
            query = "SELECT user_id, username, user_role  FROM users WHERE user_role LIKE '%RESIDENTIEL%' OR user_role LIKE '%AFFAIRE%';"
        elif param == "RESIDENTIEL" or param == "AFFAIRE":
            query = f"SELECT user_id, username, user_role FROM users WHERE user_role LIKE '%CLIENT_{param}%';"
        else:
            print("Unkown")
        mycursor.execute(query)
        data = mycursor.fetchall()
        json_data = [dict(zip([column[0] for column in mycursor.description], row)) for row in data]
        return json_data
    

    def createUser(self, username, password, role, salt, pwExpTimestamp):
        mycursor = connection.cursor(buffered=False)
        sql = "INSERT INTO users (username, user_password, user_role, salt, password_creation_date) VALUES (%s , %s, %s, %s, %s);"
        val = (username, password, role, salt, pwExpTimestamp)
        mycursor.execute(sql, val)
        connection.commit()
    
    def getLoginValidation(self, username):
        mycursor = connection.cursor(buffered=False)
        sql = ("SELECT user_id, user_role, username, salt, user_password, failed_login_attempts, next_login_time, password_creation_date FROM users WHERE username = %s;")
        val = (username,)
        mycursor.execute(sql, val)
        data = mycursor.fetchone()
        return data
    
    def updateLoginFail(self, username, attempts, next_login_time):
        mycursor = connection.cursor(buffered=False)
        sql = "UPDATE users SET failed_login_attempts = %s, next_login_time = %s WHERE username = %s; "
        val = (attempts, next_login_time, username)
        mycursor.execute(sql, val)
        connection.commit()
    
    def getUserByUsername(self, username):
        mycursor = connection.cursor(buffered=False)
        sql = ("SELECT user_id, user_role, username, user_password, salt FROM users WHERE username = %s;")
        val = (username,)
        mycursor.execute(sql, val)
        data = mycursor.fetchone()
        return data

    def getTokenValidationById(self, id):
        mycursor = connection.cursor(buffered=False)
        sql = ("SELECT username, user_role FROM users WHERE user_id = %s;")
        val = (id,)
        mycursor.execute(sql, val)
        data = mycursor.fetchone()
        return data
    
    def userExists(self, username):
        mycursor = connection.cursor(buffered=False)
        sql = ("SELECT username FROM users WHERE username = %s;")
        val = (username,)
        mycursor.execute(sql, val)
        data = mycursor.fetchone()
        return data is not None
    
    def createLog(self, event_time, event_type, user_id):
        mycursor = connection.cursor(buffered=False)
        sql = "INSERT INTO security_log (event_time, event_type, user_id) VALUES (%s, %s, %s);"
        val = (event_time, event_type, user_id)
        mycursor.execute(sql, val)
        connection.commit()

    def getLogs(self):
        mycursor = connection.cursor(buffered=False)
        mycursor.execute("""
        SELECT sl.log_id, sl.event_time, sl.event_type, sl.user_id, u.username 
        FROM security_log sl 
        JOIN users u ON sl.user_id = u.user_id;
        """)
        data = mycursor.fetchall()
        json_data = [dict(zip([column[0] for column in mycursor.description], row)) for row in data]
        return json_data

    def validateOldPassword(self, username):
        mycursor = connection.cursor(buffered=False)
        sql = "SELECT user_id, user_password, salt FROM users WHERE username = %s"
        val = (username,)
        mycursor.execute(sql, val)
        data = mycursor.fetchone()
        if data:
            return data
        else:
            return None
        
    def getOldPasswords(self, user_id):
        mycursor = connection.cursor(buffered=False)
        sql = "SELECT salt, user_password FROM old_passwords WHERE user_id = %s;"
        val = (user_id,)
        mycursor.execute(sql, val)
        data = mycursor.fetchall()
        return data
    
    def createOldPassword(self, user_id, user_password, salt):
        mycursor = connection.cursor(buffered=False)
        sql = "INSERT INTO old_passwords(user_id, user_password, salt) VALUES (%s, %s, %s);"
        val = (user_id, user_password, salt)
        mycursor.execute(sql, val)
        connection.commit()


    def updateRole(self, username, user_role):
        mycursor = connection.cursor(buffered=False)
        sql = "UPDATE users SET user_role = %s WHERE username = %s; "
        val = (user_role, username)
        mycursor.execute(sql, val)
        connection.commit()


    def updatePassword(self, username, hashed_password, salt, password_expiration):
        mycursor = connection.cursor(buffered=False)
        sql = "UPDATE users SET user_password = %s, salt = %s, password_creation_date = %s WHERE username = %s; "
        val = (hashed_password, salt, password_expiration, username)
        mycursor.execute(sql, val)
        connection.commit()

    def updatePasswordConfig(self, min_length, max_length, require_lowercase, require_uppercase, require_numbers, require_special_chars, password_expiration_time, tentative_intervale, nb_tentative, nb_mdp_ancien ):
        mycursor = connection.cursor(buffered=False)
        sql = "UPDATE password_config_changes SET min_length = %s, max_length = %s, require_lowercase = %s, require_uppercase = %s, require_numbers = %s, require_special_chars = %s, password_expiration_time = %s, tentative_intervale = %s, nb_tentative = %s, nb_mdp_ancien = %s  ;"
        val = (min_length, max_length, require_lowercase, require_uppercase, require_numbers, require_special_chars, password_expiration_time, tentative_intervale, nb_tentative, nb_mdp_ancien)
        mycursor.execute(sql, val)
        connection.commit()

    def getPasswordConfigurationJSON(self):
        mycursor = connection.cursor(buffered=False)
        sql = "SELECT min_length, max_length, require_lowercase, require_uppercase, require_numbers, require_special_chars, password_expiration_time, tentative_intervale, nb_tentative, nb_mdp_ancien FROM password_config_changes;"
        mycursor.execute(sql)
        data = mycursor.fetchall()
        json_data = [dict(zip([column[0] for column in mycursor.description], row)) for row in data]
        return json_data

    def getPasswordConfiguration(self):
        mycursor = connection.cursor(buffered=False)
        sql = "SELECT min_length, max_length, require_lowercase, require_uppercase, require_numbers, require_special_chars FROM password_config_changes;"
        mycursor.execute(sql)
        data = mycursor.fetchone()
        return data
    
    def getNumberUnreusablePassword(self):
        mycursor = connection.cursor(buffered=False)
        sql = "SELECT nb_mdp_ancien FROM password_config_changes;"
        mycursor.execute(sql)
        data = mycursor.fetchone()
        return data
    
    
    def getLoginConfig(self):
        mycursor = connection.cursor(buffered=False)
        sql = "SELECT password_expiration_time, nb_tentative, tentative_intervale FROM password_config_changes;"
        mycursor.execute(sql)
        data = mycursor.fetchone()
        return data