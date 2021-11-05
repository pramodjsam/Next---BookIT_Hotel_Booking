import nc from "next-connect";
import {
  createRoomReview,
  deleteReview,
  getRoomReviews,
} from "../../../controllers/roomControllers";
import { isAuthenticatedUser } from "../../../middlewares/auth";
import dbConnect from "../../../config/dbConnect";
import onError from "../../../middlewares/errors";

dbConnect();

const handler = nc({ onError });

handler.use(isAuthenticatedUser).put(createRoomReview);

handler.use(isAuthenticatedUser).get(getRoomReviews);

handler.use(isAuthenticatedUser).delete(deleteReview);

export default handler;
