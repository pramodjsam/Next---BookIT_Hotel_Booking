import nc from "next-connect";
import { myBookings } from "../../../controllers/bookingController";
import { isAuthenticatedUser } from "../../../middlewares/auth";
import dbConnect from "../../../config/dbConnect";
import onError from "../../../middlewares/errors";

dbConnect();

const handler = nc({ onError });

handler.use(isAuthenticatedUser).get(myBookings);

export default handler;
