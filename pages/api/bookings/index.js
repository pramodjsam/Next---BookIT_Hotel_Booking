import nc from "next-connect";
import { newBooking } from "../../../controllers/bookingController";
import { isAuthenticatedUser } from "../../../middlewares/auth";
import onError from "../../../middlewares/errors";
import dbConnect from "../../../config/dbConnect";

dbConnect();

const handler = nc({ onError });

handler.use(isAuthenticatedUser).post(newBooking);

export default handler;
