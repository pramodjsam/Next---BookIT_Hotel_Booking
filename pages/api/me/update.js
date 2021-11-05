import nc from "next-connect";
import { updateUser } from "../../../controllers/authControllers";
import { isAuthenticatedUser } from "../../../middlewares/auth";
import onError from "../../../middlewares/errors";
import dbConnect from "../../../config/dbConnect";

const handler = nc({ onError });

dbConnect();

handler.use(isAuthenticatedUser).put(updateUser);

export default handler;
