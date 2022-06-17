import { ServerResponse } from "http"
import { ErrorsEnum, ResponseCodes } from "../models"

export const setResponseInvalidUserId = (res: ServerResponse): void => {
  setResponseError(res, ResponseCodes.BAD_REQUEST, ErrorsEnum.INVALID_ID);
}

export const setResponseUserNotExist = (res: ServerResponse): void => {
  setResponseError(res, ResponseCodes.NOT_FOUND, ErrorsEnum.USER_NOT_FOUND);
}

export const setResponseInvalidDataType = (res: ServerResponse): void => {
  setResponseError(res, ResponseCodes.BAD_REQUEST, ErrorsEnum.INVALID_DATA_TYPES);
}

export const setResponseMissingRequireData = (res: ServerResponse): void => {
  setResponseError(res, ResponseCodes.BAD_REQUEST, ErrorsEnum.REQUIRED_PARAMS_MISSING);
}

export const setResponseError = (res: ServerResponse, code: number, error: string): void => {
  res.writeHead(code, error);
  res.end(error);
}