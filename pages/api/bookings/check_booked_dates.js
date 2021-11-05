import nc from "next-connect";
import { checkBookedDatesOfRoom } from "../../../controllers/bookingController";
import dbConnect from "../../../config/dbConnect";
import onError from "../../../middlewares/errors";

dbConnect();

const handler = nc({ onError });

handler.get(checkBookedDatesOfRoom);

export default handler;
