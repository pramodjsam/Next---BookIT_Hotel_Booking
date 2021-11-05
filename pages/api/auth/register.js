import nc from "next-connect";
import { registerUser } from "../../../controllers/authControllers";
import onError from "../../../middlewares/errors";
import dbConnect from "../../../config/dbConnect";

dbConnect();

const handler = nc({ onError });

handler.post(registerUser);

export default handler;
