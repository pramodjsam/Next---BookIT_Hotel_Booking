import nc from "next-connect";
import { stripeCheckoutSession } from "../../../controllers/paymentControllers";
import { isAuthenticatedUser } from "../../../middlewares/auth";
import onError from "../../../middlewares/errors";
import dbConnect from "../../../config/dbConnect";

dbConnect();

const handler = nc({ onError });

handler.use(isAuthenticatedUser).get(stripeCheckoutSession);

export default handler;
