import nc from "next-connect";
import dbConnect from "../../../config/dbConnect";
import { forgetPassword } from "../../../controllers/authControllers";
import onError from "../../../middlewares/errors";

dbConnect();

const handler = nc({ onError });

handler.post(forgetPassword);

export default handler;
