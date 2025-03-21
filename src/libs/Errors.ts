// Errors.ts (Yangi versiya)
export enum HttpCode {
  OK = 200,
  CREATED = 201,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum Message {
  SOMETHING_WENT_WRONG = "Something went wrong!",
  NO_DATA_FOUND = "No data is found!",
  CREATE_FAILED = "Create is failed!",
  UPDATE_FAILED = "Update is failed!",
  USED_NICK_PHONE = "You are inserting already used nick or phone",
  NOT_MEMBER_NICK = "No member with that member nick",
  WRONG_PASSWORD = "Wrong password inserted, please try again"
}

class Errors extends Error {
  public code: HttpCode;
  public message: string;  // message tipini stringga o‘zgartiring

  constructor(statusCode: HttpCode, statusMessage: string) {
    super(statusMessage);
    this.code = statusCode;
    this.message = statusMessage;
  }
}

export default Errors;

