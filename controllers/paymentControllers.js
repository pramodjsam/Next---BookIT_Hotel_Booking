import catchAsyncError from "../middlewares/catchAsyncError";
import Room from "../models/room";
import User from "../models/user";
import Booking from "../models/booking";
import absoluteUrl from "next-absolute-url";
import getRawBody from "raw-body";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const stripeCheckoutSession = catchAsyncError(async (req, res) => {
  const room = await Room.findById(req.query.roomId);

  const { origin } = absoluteUrl(req);

  const { checkInDate, checkOutDate, daysOfStay } = req.query;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${origin}/bookings/me`,
    cancel_url: `${origin}/room/${room._id}`,
    customer_email: req.user.email,
    client_reference_id: req.query.roomId,
    metadata: {
      checkInDate,
      checkOutDate,
      daysOfStay,
    },
    line_items: [
      {
        name: room.name,
        images: [`${room.images[0].url}`],
        amount: req.query.amount * 100,
        currency: "usd",
        quantity: 1,
      },
    ],
  });
  // console.log(session);
  res.status(200).json(session);
});

//Need to use stripe-cli for this webhook
// stripe listen --events checkout.session.completed --forward-to localhost:3000/api/webhook
export const webhookCheckout = catchAsyncError(async (req, res) => {
  const rawBody = await getRawBody(req);
  try {
    const signature = req.headers["stripe-signature"];

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const room = session.client_reference_id;
      const user = (await User.findOne({ email: session.customer_email }))._id;
      const amountPaid = session.amount_total / 100;
      const payment_info = {
        id: session.payment_intent,
        status: session.payment_status,
      };
      const checkInDate = session.metadata.checkInDate;
      const checkOutDate = session.metadata.checkOutDate;
      const daysOfStay = session.metadata.daysOfStay;

      const booking = await Booking.create({
        room,
        checkInDate,
        checkOutDate,
        daysOfStay,
        amountPaid,
        paymentInfo: payment_info,
        user,
        paidAt: Date.now(),
      });

      await booking.save();

      res.status(200).json({
        success: true,
      });
    }
  } catch (err) {
    console.log(err);
  }
});
