import crypto from "crypto";
import catchAsyncError from "../middlewares/catchAsyncError";
import User from "../models/user";
import cloudinary from "cloudinary";
import absoluteUrl from "next-absolute-url";
import ErrorHandler from "../utils/errorHandler";
import sendEmail from "../utils/sendEmail";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const registerUser = catchAsyncError(async (req, res) => {
  const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "cserver/uploads",
    width: "150",
    crop: "scale",
  });

  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: result.public_id,
      url: result.secure_url,
    },
  });

  res.status(200).json({
    success: true,
    message: "Account registered successfully",
  });
});

export const currentUser = catchAsyncError(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

export const updateUser = catchAsyncError(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name;
    user.email = req.body.email;

    if (req.body.password) user.password = req.body.password;

    if (req.body.avatar !== "") {
      const image_id = user.avatar.public_id;
      await cloudinary.v2.uploader.destroy(image_id);

      const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "cserver/uploads",
        width: "150",
        crop: "scale",
      });

      user.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
    });
  }
});

export const forgetPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const { origin } = absoluteUrl(req);

  const resetUrl = `${origin}/password/reset/${resetToken}`;
  const message = `Your password reset url is as follows \n\n ${resetUrl}\n\n If you have not requested this email, please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "BooKIT Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(err.message, 500));
  }
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.query.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords does not match", 403));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password resetted successfully",
  });
});

export const allUsers = catchAsyncError(async (req, res) => {
  const users = await User.find({});

  res.status(200).json({
    success: true,
    users,
  });
});

export const getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.query.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

export const updateUserDetails = catchAsyncError(async (req, res) => {
  const newUserDetails = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const { data } = await User.findByIdAndUpdate(req.query.id, newUserDetails, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
  });
});

export const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.query.id);

  if (!user) {
    return next(new ErrorHandler("No user found", 404));
  }

  const imageId = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();

  res.status(200).json({
    success: true,
  });
});
