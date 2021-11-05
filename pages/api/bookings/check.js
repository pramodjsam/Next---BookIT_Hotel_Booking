import nc from "next-connect";
import { checkRoomBookingsAvailability } from "../../../controllers/bookingController";
import dbConnect from "../../../config/dbConnect";
import onError from "../../../middlewares/errors";

dbConnect();

const handler = nc({ onError });

handler.get(checkRoomBookingsAvailability);

export default handler;
