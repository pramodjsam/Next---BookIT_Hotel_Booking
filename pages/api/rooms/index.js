import nc from "next-connect";
import dbConnect from "../../../config/dbConnect";
import { allRooms, newRoom } from "../../../controllers/roomControllers";
import { authorizeRoles, isAuthenticatedUser } from "../../../middlewares/auth";

import onError from "../../../middlewares/errors";

const handler = nc({ onError });

dbConnect();

handler.get(allRooms);

handler.use(isAuthenticatedUser, authorizeRoles("admin")).post(newRoom);

export default handler;
