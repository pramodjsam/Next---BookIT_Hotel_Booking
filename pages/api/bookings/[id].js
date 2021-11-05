import nc from "next-connect";
import { getBookingDetails } from "../../../controllers/bookingController";
import { isAuthenticatedUser } from "../../../middlewares/auth";
import onError from "../../../middlewares/errors";
import dbConnect from "../../../config/dbConnect";

dbConnect();

const handler = nc({ onError });

handler.use(isAuthenticatedUser).get(getBookingDetails);

export default handler;
