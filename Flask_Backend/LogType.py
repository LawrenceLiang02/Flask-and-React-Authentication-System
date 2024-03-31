from enum import Enum

class LogType(Enum):
    SUCCESS = "LOGIN_SUCCESS"
    FAILURE = "LOGIN_FAIL"
    PASSWORD_CHANGE = "PASSWORD_CHANGE"
    LOGOUT = "LOGOUT"
    OTHER = "OTHER"
    