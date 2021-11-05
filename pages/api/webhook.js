import nc from "next-connect";
import { webhookCheckout } from "../../controllers/paymentControllers";
import onError from "../../middlewares/errors";

const handler = nc({ onError });

handler.post(webhookCheckout);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
