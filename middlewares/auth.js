import catchAsyncError from "./catchAsyncError";
import { getSession } from "next-auth/client";
import ErrorHandler from "../utils/errorHandler";

export const isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const session = await getSession({ req });

  if (!session) {
    return next(new ErrorHandler("Login to access the route", 401));
  }

  req.user = session.user;
  next();
});

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
