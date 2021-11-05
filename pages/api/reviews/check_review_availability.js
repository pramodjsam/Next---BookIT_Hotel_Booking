import nc from "next-connect";
import { checkReviewAvailability } from "../../../controllers/roomControllers";
import { isAuthenticatedUser } from "../../../middlewares/auth";
import dbConnect from "../../../config/dbConnect";
import onError from "../../../middlewares/errors";

dbConnect();

const handler = nc({ onError });

handler.use(isAuthenticatedUser).get(checkReviewAvailability);

export default handler;
