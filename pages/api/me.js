import nc from "next-connect";
import { currentUser } from "../../controllers/authControllers";
import { isAuthenticatedUser } from "../../middlewares/auth";
import onError from "../../middlewares/errors";
import dbConnect from "../../config/dbConnect";

dbConnect();

const handler = nc({ onError });

handler.use(isAuthenticatedUser).get(currentUser);

export default handler;
