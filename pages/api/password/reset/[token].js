import nc from "next-connect";
import { resetPassword } from "../../../../controllers/authControllers";
import onError from "../../../../middlewares/errors";
import dbConnect from "../../../../config/dbConnect";

dbConnect();

const handler = nc({ onError });

handler.put(resetPassword);

export default handler;
