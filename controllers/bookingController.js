import Booking from "../models/booking";
import catchAsyncError from "../middlewares/catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import Moment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(Moment);

export const newBooking = catchAsyncError(async (req, res) => {
  const {
    room,
    checkInDate,
    checkOutDate,
    daysOfStay,
    amountPaid,
    paymentInfo,
  } = req.body;

  const booking = await Booking.create({
    room,
    checkInDate,
    checkOutDate,
    daysOfStay,
    amountPaid,
    paymentInfo,
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    booking,
  });
});

export const checkRoomBookingsAvailability = catchAsyncError(
  async (req, res) => {
    let { roomId, checkInDate, checkOutDate } = req.query;
    checkInDate = new Date(checkInDate);
    checkOutDate = new Date(checkOutDate);

    const bookings = await Booking.find({
      room: roomId,
      $and: [
        {
          checkInDate: {
            $lte: checkOutDate,
          },
        },
        {
          checkOutDate: {
            $gte: checkInDate,
          },
        },
      ],
    });

    let isAvailable;
    if (bookings && bookings.length === 0) {
      isAvailable = true;
    } else {
      isAvailable = false;
    }

    res.status(200).json({
      success: true,
      isAvailable,
    });
  }
);

export const checkBookedDatesOfRoom = catchAsyncError(async (req, res) => {
  const { roomId } = req.query;

  const bookings = await Booking.find({ room: roomId });

  let bookedDates = [];
  const timeDifference = moment().utcOffset() / 60;

  bookings.forEach((booking) => {
    const checkInDate = moment(booking.checkInDate).add(
      timeDifference,
      "hours"
    );
    const checkOutDate = moment(booking.checkOutDate).add(
      timeDifference,
      "hours"
    );

    const range = moment.range(moment(checkInDate), moment(checkOutDate));

    bookedDates.push(...range.by("day"));
  });

  res.status(200).json({
    success: true,
    bookedDates,
  });
});

export const myBookings = catchAsyncError(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate({
      path: "room",
      select: "name pricePerNight images",
    })
    .populate({
      path: "user",
      select: "name email",
    });

  res.status(200).json({
    success: true,
    bookings,
  });
});

export const getBookingDetails = catchAsyncError(async (req, res) => {
  const booking = await Booking.findById(req.query.id)
    .populate({
      path: "room",
      select: "name pricePerNight images",
    })
    .populate({
      path: "user",
      select: "name email",
    });

  res.status(200).json({
    success: true,
    booking,
  });
});

export const allAdminBookings = catchAsyncError(async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate({
        path: "room",
        select: "name pricePerNight images",
      })
      .populate({
        path: "user",
        select: "name email",
      });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (err) {
    console.log(err);
  }
});

export const deleteBooking = catchAsyncError(async (req, res, next) => {
  const booking = await Booking.findById(req.query.id);

  if (!booking) {
    return next(new ErrorHandler("Booking not found", 404));
  }

  await booking.remove();

  res.status(200).json({
    success: true,
  });
});
