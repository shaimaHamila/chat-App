import { Request, Response, NextFunction } from "express";
import { Socket } from "socket.io";
import { encrypt } from "../helpers/helpers";
import { Responses } from "../helpers/Response";

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) {
    return Responses.Unauthorized(res, "No token provided in cookies.");
  }

  try {
    const decodedToken = encrypt.verifyToken(token);
    res.locals.decodedToken = decodedToken;
    next();
  } catch (error) {
    if (error) {
      return Responses.Unauthorized(res, "Invalid or expired token.");
    }
    return Responses.BadRequest(res, "Token verification failed.");
  }
};

// Adapted authentication middleware for Socket.IO
export const socketAuthentication = (
  socket: Socket,
  next: (err?: Error) => void
) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("No token provided in cookies."));
  }

  try {
    const decodedToken = encrypt.verifyToken(token);
    socket.data.decodedToken = decodedToken;
    next();
  } catch (error) {
    if (error) {
      return next(new Error("Unauthorized: Invalid or expired token"));
    }
    return next(new Error("Bad Request: Token verification failed"));
  }
};
