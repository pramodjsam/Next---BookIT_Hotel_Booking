import nc from "next-connect";
import dbConnect from "../../../../config/dbConnect";
import onError from "../../../../middlewares/errors";
import { deleteBooking } from "../../../../controllers/bookingController";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "../../../../middlewares/auth";

dbConnect();

const handler = nc({ onError });

handler.use(isAuthenticatedUser, authorizeRoles("admin")).delete(deleteBooking);

export default handler;
