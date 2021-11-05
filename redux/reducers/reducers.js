import { combineReducers } from "redux";
import {
  adminBookingsReducer,
  bookedDatesReducer,
  bookingDetailsReducer,
  bookingsReducer,
  checkBookingReducer,
  deleteBookingReducer,
} from "./bookingReducers";
import {
  allRoomsReducer,
  checkReviewReducer,
  deleteReviewReducer,
  deleteRoomReducer,
  newReviewReducer,
  newRoomReducer,
  roomDetailsReducer,
  roomReviewsReducer,
  updateRoomReducer,
} from "./roomReducers";
import {
  allUsersReducer,
  authReducer,
  forgotPasswordReducer,
  loadUserReducer,
  userDetailsReducer,
  userReducer,
} from "./userReducers";

const reducer = combineReducers({
  allRooms: allRoomsReducer,
  newRoom: newRoomReducer,
  updateRoom: updateRoomReducer,
  deleteRoom: deleteRoomReducer,
  roomDetails: roomDetailsReducer,
  auth: authReducer,
  user: userReducer,
  forgotPassword: forgotPasswordReducer,
  loadUser: loadUserReducer,
  allUsers: allUsersReducer,
  userDetails: userDetailsReducer,
  checkBooking: checkBookingReducer,
  bookedDates: bookedDatesReducer,
  bookings: bookingsReducer,
  bookingDetails: bookingDetailsReducer,
  adminBookings: adminBookingsReducer,
  deleteBooking: deleteBookingReducer,
  newReview: newReviewReducer,
  checkReview: checkReviewReducer,
  roomReviews: roomReviewsReducer,
  deleteReview: deleteReviewReducer,
});

export default reducer;
