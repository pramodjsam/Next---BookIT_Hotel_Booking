import nc from "next-connect";
import dbConnect from "../../../../config/dbConnect";
import { allUsers } from "../../../../controllers/authControllers";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "../../../../middlewares/auth";
import onError from "../../../../middlewares/errors";

dbConnect();

const handler = nc({ onError });

handler.use(isAuthenticatedUser, authorizeRoles("admin")).get(allUsers);

export default handler;
