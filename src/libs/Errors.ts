export enum HttpCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum Message {
  SOMETHING_WENT_WRONG = "Something went wrong!",
  NO_DATA_FOUND = "No data found!",
  CREATE_FAILED = "Failed to create record!",
  LOGIN_FAILED = "Login failed!",
  NOT_MEMBER_NICK = "User not found!",
  WRONG_PASSWORD = "Incorrect password!"
}

class Errors extends Error {
  public code: number;

  constructor(statusCode: HttpCode, statusMessage: string) {
    super(statusMessage);
    this.code = statusCode;
    this.message = statusMessage;
  }
}

export default Errors;


