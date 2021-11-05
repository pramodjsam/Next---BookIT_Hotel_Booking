import catchAsyncError from "../middlewares/catchAsyncError";
import Room from "../models/room";
import Booking from "../models/booking";
import ApiFeatures from "../utils/apiFeatures";
import ErrorHandler from "../utils/errorHandler";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const search = (req) => {
  const location = req.query.location
    ? { address: { $regex: req.query.location, $options: "i" } }
    : {};
  return Room.find({ ...location });
};

const filter = (req, roomModel) => {
  const queryCopy = { ...req.query };

  const removeFields = ["location"];
  removeFields.forEach((el) => delete queryCopy[el]);

  return roomModel.find(queryCopy);
};

const pagination = (req, resPerPage, roomModel) => {
  const currentPage = Number(req.query.page) || 1;
  const skip = resPerPage * (currentPage - 1);
  return roomModel.limit(resPerPage).skip(skip);
};

export const allRooms = catchAsyncError(async (req, res) => {
  // let rooms = search(req);
  // rooms = await filter(req, rooms);
  // rooms = await pagination(req,resPerPage,rooms)
  const resPerPage = 4;
  const roomsCount = await Room.countDocuments();

  const apiFeatures = new ApiFeatures(Room, req.query)
    .search()
    .filter()
    .pagination(resPerPage);

  let rooms = await apiFeatures.query;
  const filteredRoomsRount = rooms.length;

  res.status(200).json({
    success: true,
    roomsCount,
    resPerPage,
    filteredRoomsRount,
    rooms,
  });
});

export const getSingleRoom = catchAsyncError(async (req, res, next) => {
  const room = await Room.findById(req.query.id);

  if (!room) {
    return next(new ErrorHandler("Room not found with this ID", 404));
  }

  res.status(200).json({
    success: true,
    room,
  });
});

export const newRoom = catchAsyncError(async (req, res) => {
  const images = req.body.images;

  let imagesLinks = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "cserver/uploads",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user._id;

  try {
    const room = await Room.create(req.body);
    res.status(200).json({
      success: true,
      room,
    });
  } catch (err) {
    console.log(err);
  }
});

export const updateRoom = catchAsyncError(async (req, res, next) => {
  let room = await Room.findById(req.query.id);

  if (!room) {
    return next(new ErrorHandler("Room not found with this ID", 404));
  }

  if (req.body.images) {
    for (let i = 0; i < room.images.length; i++) {
      await cloudinary.v2.uploader.destroy(room.images[i].public_id);
    }

    const images = req.body.images;

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "cserver/uploads",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    req.body.images = imagesLinks;
  }
  room = await Room.findByIdAndUpdate(req.query.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    room,
  });
});

export const deleteRoom = catchAsyncError(async (req, res, next) => {
  const room = await Room.findById(req.query.id);

  if (!room) {
    return next(new ErrorHandler("Room not found with this ID", 404));
  }

  for (let i = 0; i < room.images.length; i++) {
    await cloudinary.v2.uploader.destroy(room.images[i].public_id);
  }

  await room.remove();

  res.status(200).json({
    success: true,
    message: "Room deleted successfully",
  });
});

export const createRoomReview = catchAsyncError(async (req, res) => {
  const { rating, comment, roomId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const room = await Room.findById(roomId);

  const isReviewed = room.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    room.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    room.reviews.push(review);
    room.numReviews = room.reviews.length;
  }
  room.ratings =
    room.reviews.reduce((acc, item) => item.rating + acc, 0) /
    room.reviews.length;

  await room.save({ validateBeforeSave: false });

  res.status(200).json({ success: true });
});

export const checkReviewAvailability = catchAsyncError(async (req, res) => {
  const { roomId } = req.query;

  const bookings = await Booking.find({ user: req.user._id, room: roomId });

  let isReviewAvailable = false;
  if (bookings.length > 0) isReviewAvailable = true;

  res.status(200).json({
    success: true,
    isReviewAvailable,
  });
});

export const allAdminRooms = catchAsyncError(async (req, res) => {
  const rooms = await Room.find();

  res.status(200).json({
    success: true,
    rooms,
  });
});

export const getRoomReviews = catchAsyncError(async (req, res) => {
  const room = await Room.findById(req.query.id);

  res.status(200).json({
    success: true,
    reviews: room.reviews,
  });
});

export const deleteReview = catchAsyncError(async (req, res) => {
  const room = await Room.findById(req.query.roomId);

  const reviews = room.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );

  const numReviews = reviews.length;
  const ratings =
    room.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

  await Room.findByIdAndUpdate(
    req.query.roomId,
    {
      reviews,
      numReviews,
      ratings,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
  });
});
