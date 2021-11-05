import nc from "next-connect";
import { allAdminRooms } from "../../../../controllers/roomControllers";
import dbConnect from "../../../../config/dbConnect";
import onError from "../../../../middlewares/errors";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "../../../../middlewares/auth";

dbConnect();

const handler = nc({ onError });

handler.use(isAuthenticatedUser, authorizeRoles("admin")).get(allAdminRooms);

export default handler;
