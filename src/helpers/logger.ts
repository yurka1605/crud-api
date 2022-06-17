import { ResponseCodes } from "../models";
import { error as printError, info } from "./printer";

export const logData = (method: string, url: string, code: number, status: string): void => {
  const logMethod = [
    ResponseCodes.OK, ResponseCodes.CREATED, ResponseCodes.NO_CONTENT
  ].includes(code) ? info : printError;
  logMethod(`${method} ${url} - ${code} ${status}`);
} 