import axios from "axios";
import absoluteUrl from "next-absolute-url";
import {
  ADMIN_ROOM_FAIL,
  ADMIN_ROOM_REQUEST,
  ADMIN_ROOM_SUCCESS,
  ALL_ROOMS_FAIL,
  ALL_ROOMS_SUCCESS,
  CLEAR_ERROR,
  DELETE_REVIEW_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_ROOM_FAIL,
  DELETE_ROOM_REQUEST,
  DELETE_ROOM_SUCCESS,
  GET_REVIEWS_FAIL,
  GET_REVIEWS_REQUEST,
  GET_REVIEWS_SUCCESS,
  NEW_REVIEW_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  NEW_ROOM_FAIL,
  NEW_ROOM_REQUEST,
  NEW_ROOM_SUCCESS,
  REVIEW_AVAILABILITY_FAIL,
  REVIEW_AVAILABILITY_REQUEST,
  REVIEW_AVAILABILITY_SUCCESS,
  ROOM_DETAILS_FAIL,
  ROOM_DETAILS_SUCCESS,
  UPDATE_ROOM_FAIL,
  UPDATE_ROOM_REQUEST,
  UPDATE_ROOM_SUCCESS,
} from "../constants/roomConstants";

export const getRooms =
  (req, currentPage = 1, location = "", category, guests) =>
  async (dispatch) => {
    try {
      const { origin } = absoluteUrl(req);
      let link = `${origin}/api/rooms?page=${currentPage}&location=${location}`;
      if (category) link = link.concat(`&category=${category}`);

      if (guests) link = link.concat(`&guestCapacity=${guests}`);

      const { data } = await axios.get(link);

      dispatch({
        type: ALL_ROOMS_SUCCESS,
        payload: data,
      });
    } catch (err) {
      dispatch({
        type: ALL_ROOMS_FAIL,
        payload: err.response ? err.response.data.message : err.message,
      });
    }
  };

export const getRoomDetails = (req, id) => async (dispatch) => {
  try {
    const { origin } = absoluteUrl(req);
    let url;
    if (req) {
      url = `${origin}/api/rooms/${id}`;
    } else {
      url = `/api/rooms/${id}`;
    }

    const { data } = await axios.get(url);

    dispatch({
      type: ROOM_DETAILS_SUCCESS,
      payload: data.room,
    });
  } catch (err) {
    dispatch({
      type: ROOM_DETAILS_FAIL,
      error: err.response ? err.response.data.message : err.message,
    });
  }
};

export const newRoom = (roomData) => async (dispatch) => {
  try {
    dispatch({
      type: NEW_ROOM_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post("/api/rooms", roomData, config);

    dispatch({
      type: NEW_ROOM_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: NEW_ROOM_FAIL,
      payload: err.message,
    });
  }
};

export const updateRoom = (id, roomData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_ROOM_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.put(`/api/rooms/${id}`, roomData, config);

      dispatch({
        type: UPDATE_ROOM_SUCCESS,
        payload: data.success,
      });
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    dispatch({
      type: UPDATE_ROOM_FAIL,
      payload: err.message,
    });
  }
};

export const deleteRoom = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_ROOM_REQUEST });

    const { data } = await axios.delete(`/api/rooms/${id}`);

    dispatch({
      type: DELETE_ROOM_SUCCESS,
      payload: data.success,
    });
  } catch (err) {
    dispatch({
      type: DELETE_ROOM_FAIL,
      payload: err.message,
    });
  }
};

export const roomReview = (reviewData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_REVIEW_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.put("/api/reviews", reviewData, config);

    dispatch({
      type: NEW_REVIEW_SUCCESS,
      payload: data.success,
    });
  } catch (err) {
    dispatch({
      type: NEW_REVIEW_FAIL,
      payload: err.message,
    });
  }
};

export const checkReview = (roomId) => async (dispatch) => {
  try {
    dispatch({ type: REVIEW_AVAILABILITY_REQUEST });

    const { data } = await axios.get(
      `/api/reviews/check_review_availability?roomId=${roomId}`
    );

    dispatch({
      type: REVIEW_AVAILABILITY_SUCCESS,
      payload: data.isReviewAvailable,
    });
  } catch (err) {
    dispatch({
      type: REVIEW_AVAILABILITY_FAIL,
      payload: err.message,
    });
  }
};

export const getAdminRooms = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_ROOM_REQUEST });

    const { data } = await axios.get("/api/admin/rooms");

    dispatch({ type: ADMIN_ROOM_SUCCESS, payload: data.rooms });
  } catch (err) {
    dispatch({
      type: ADMIN_ROOM_FAIL,
      payload: err.message,
    });
  }
};

export const getRoomReviews = (id) => async (dispatch) => {
  try {
    dispatch({
      type: GET_REVIEWS_REQUEST,
    });

    const { data } = await axios.get(`/api/reviews?id=${id}`);

    dispatch({
      type: GET_REVIEWS_SUCCESS,
      payload: data.reviews,
    });
  } catch (err) {
    dispatch({
      type: GET_REVIEWS_FAIL,
      payload: err.message,
    });
  }
};

export const deleteReview = (id, roomId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_REVIEW_REQUEST });

    const { data } = await axios.delete(
      `/api/reviews/?id=${id}&roomId=${roomId}`
    );

    dispatch({
      type: DELETE_REVIEW_SUCCESS,
      payload: data.success,
    });
  } catch (err) {
    dispatch({
      type: DELETE_REVIEW_FAIL,
      payload: err.message,
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERROR,
  });
};
