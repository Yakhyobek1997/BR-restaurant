export enum HttpCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  NOT_MODIFIED,
}

export enum Message {
  SOMETHING_WENT_WRONG = "Something went wrong!",
  NO_DATA_FOUND = "No data found!",
  CREATE_FAILED = "Failed to create record!",
  LOGIN_FAILED = "Login failed!",
  NOT_MEMBER_NICK = "User not found!",
  WRONG_PASSWORD = "Incorrect password!",
  USED_NICK_PHONE = "You are inserting already used nick or phone",
  MEMBER_NOT_FOUND = " Error memebr not found",
  NOT_AUTHENTICATED = "You are not authenticated, Please login first",
  UPDATE_FAILED = "UPDATE_FAILED"
}

class Errors extends Error {
  public code: HttpCode;
  public message: Message;

  static standard = {
    code: HttpCode.INTERNAL_SERVER_ERROR,
    message: Message.SOMETHING_WENT_WRONG,
  };

  constructor(statusCode: HttpCode, statusMessage: Message) {
    super();
    this.code = statusCode;
    this.message = statusMessage;
  }
}

export default Errors;


