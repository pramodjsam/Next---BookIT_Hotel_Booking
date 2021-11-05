import axios from "axios";
import absoluteUrl from "next-absolute-url";
import {
  ADMIN_BOOKINGS_FAIL,
  ADMIN_BOOKINGS_REQUEST,
  ADMIN_BOOKINGS_SUCCESS,
  BOOKED_DATES_FAIL,
  BOOKED_DATES_SUCCESS,
  BOOKING_DETAILS_FAIL,
  BOOKING_DETAILS_SUCCESS,
  CHECK_BOOKING_FAIL,
  CHECK_BOOKING_REQUEST,
  CHECK_BOOKING_SUCCESS,
  CLEAR_ERROR,
  DELETE_BOOKING_FAIL,
  DELETE_BOOKING_REQUEST,
  DELETE_BOOKING_SUCCESS,
  MY_BOOKINGS_FAIL,
  MY_BOOKINGS_SUCCESS,
} from "../constants/bookingConstants";

export const checkBooking =
  (roomId, checkInDate, checkOutDate) => async (dispatch) => {
    try {
      dispatch({ type: CHECK_BOOKING_REQUEST });

      const link = `/api/bookings/check?roomId=${roomId}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`;
      const { data } = await axios.get(link);

      dispatch({
        type: CHECK_BOOKING_SUCCESS,
        payload: data.isAvailable,
      });
    } catch (err) {
      dispatch({
        type: CHECK_BOOKING_FAIL,
        payload: err.response ? err.response.data.message : err.message,
      });
    }
  };

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERROR });
};

export const getBookedDates = (id) => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `/api/bookings/check_booked_dates?roomId=${id}`
    );

    dispatch({
      type: BOOKED_DATES_SUCCESS,
      payload: data.bookedDates,
    });
  } catch (err) {
    dispatch({
      type: BOOKED_DATES_FAIL,
      payload: err.response ? err.response.data.message : err.message,
    });
  }
};

export const myBookings = (authCookie, req) => async (dispatch) => {
  try {
    const config = {
      headers: {
        cookie: authCookie,
      },
    };

    const { origin } = absoluteUrl(req);

    const { data } = await axios.get(`${origin}/api/bookings/me`, config);

    dispatch({
      type: MY_BOOKINGS_SUCCESS,
      payload: data.bookings,
    });
  } catch (err) {
    dispatch({
      type: MY_BOOKINGS_FAIL,
      payload: err.response ? err.response.data.message : err.message,
    });
  }
};

export const getBookingDetails = (authCookie, req, id) => async (dispatch) => {
  try {
    const config = {
      headers: {
        cookie: authCookie,
      },
    };

    const { origin } = absoluteUrl(req);

    const { data } = await axios.get(`${origin}/api/bookings/${id}`, config);

    dispatch({ type: BOOKING_DETAILS_SUCCESS, payload: data.booking });
  } catch (err) {
    dispatch({
      type: BOOKING_DETAILS_FAIL,
      payload: err.response ? err.response.data.message : err.message,
    });
  }
};

export const adminBookings = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_BOOKINGS_REQUEST });

    const { data } = await axios.get("/api/admin/bookings");

    dispatch({
      type: ADMIN_BOOKINGS_SUCCESS,
      payload: data.bookings,
    });
  } catch (err) {
    dispatch({
      type: ADMIN_BOOKINGS_FAIL,
      payload: err.message,
    });
  }
};

export const deleteBooking = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_BOOKING_REQUEST });

    const { data } = await axios.delete(`/api/admin/bookings/${id}`);

    dispatch({
      type: DELETE_BOOKING_SUCCESS,
      payload: data.success,
    });
  } catch (err) {
    dispatch({
      type: DELETE_BOOKING_FAIL,
      payload: err.message,
    });
  }
};
