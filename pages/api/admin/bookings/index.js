import nc from "next-connect";
import dbConnect from "../../../../config/dbConnect";
import onError from "../../../../middlewares/errors";
import { allAdminBookings } from "../../../../controllers/bookingController";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "../../../../middlewares/auth";

dbConnect();

const handler = nc({ onError });

handler.use(isAuthenticatedUser, authorizeRoles("admin")).get(allAdminBookings);

export default handler;
