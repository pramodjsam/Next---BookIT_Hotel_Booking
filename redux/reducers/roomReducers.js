import {
  ADMIN_ROOM_FAIL,
  ADMIN_ROOM_REQUEST,
  ADMIN_ROOM_SUCCESS,
  ALL_ROOMS_FAIL,
  ALL_ROOMS_SUCCESS,
  CLEAR_ERROR,
  DELETE_REVIEW_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_RESET,
  DELETE_REVIEW_SUCCESS,
  DELETE_ROOM_FAIL,
  DELETE_ROOM_REQUEST,
  DELETE_ROOM_RESET,
  DELETE_ROOM_SUCCESS,
  GET_REVIEWS_FAIL,
  GET_REVIEWS_REQUEST,
  GET_REVIEWS_SUCCESS,
  NEW_REVIEW_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_RESET,
  NEW_REVIEW_SUCCESS,
  NEW_ROOM_FAIL,
  NEW_ROOM_REQUEST,
  NEW_ROOM_RESET,
  NEW_ROOM_SUCCESS,
  REVIEW_AVAILABILITY_FAIL,
  REVIEW_AVAILABILITY_REQUEST,
  REVIEW_AVAILABILITY_SUCCESS,
  ROOM_DETAILS_FAIL,
  ROOM_DETAILS_RESET,
  ROOM_DETAILS_SUCCESS,
  UPDATE_ROOM_FAIL,
  UPDATE_ROOM_REQUEST,
  UPDATE_ROOM_RESET,
  UPDATE_ROOM_SUCCESS,
} from "../constants/roomConstants";

export const allRoomsReducer = (state = { rooms: [] }, action) => {
  switch (action.type) {
    case ADMIN_ROOM_REQUEST:
      return { loading: true };
    case ALL_ROOMS_SUCCESS:
      return {
        roomsCount: action.payload.roomsCount,
        filteredRoomsCount: action.payload.filteredRoomsRount,
        rooms: action.payload.rooms,
        resPerPage: action.payload.resPerPage,
      };
    case ADMIN_ROOM_SUCCESS:
      return { loading: false, rooms: action.payload };
    case ALL_ROOMS_FAIL:
      return {
        error: action.payload,
      };
    case ADMIN_ROOM_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const newRoomReducer = (state = { room: {} }, action) => {
  switch (action.type) {
    case NEW_ROOM_REQUEST:
      return { loading: true };
    case NEW_ROOM_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        room: action.payload.room,
      };
    case NEW_ROOM_FAIL:
      return { loading: false, error: action.payload };
    case NEW_ROOM_RESET:
      return { loading: false, success: null, room: null };
    case CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const roomDetailsReducer = (state = { room: {} }, action) => {
  switch (action.type) {
    case ROOM_DETAILS_SUCCESS:
      return {
        room: action.payload,
      };
    case ROOM_DETAILS_RESET:
      return { room: {} };
    case ROOM_DETAILS_FAIL:
      return {
        error: action.payload,
      };

    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const newReviewReducer = (state = { error: null }, action) => {
  switch (action.type) {
    case NEW_REVIEW_REQUEST:
      return { loading: true };
    case NEW_REVIEW_SUCCESS:
      return { loading: false, success: action.payload };
    case NEW_REVIEW_FAIL:
      return { loading: false, error: action.payload };
    case NEW_REVIEW_RESET:
      return { success: false };
    case CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const checkReviewReducer = (state = {}, action) => {
  switch (action.type) {
    case REVIEW_AVAILABILITY_REQUEST:
      return { loading: true };
    case REVIEW_AVAILABILITY_SUCCESS:
      return { loading: false, reviewAvailable: action.payload };
    case REVIEW_AVAILABILITY_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const updateRoomReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_ROOM_REQUEST:
      return { loading: true };
    case UPDATE_ROOM_SUCCESS:
      return { loading: false, isUpdated: action.payload };
    case UPDATE_ROOM_FAIL:
      return { loading: false, error: action.payload };
    case UPDATE_ROOM_RESET:
      return { loading: false, isUpdated: null, error: null };
    case CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const deleteRoomReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_ROOM_REQUEST:
      return { loading: true };
    case DELETE_ROOM_SUCCESS:
      return { loading: false, isDeleted: action.payload };
    case DELETE_ROOM_FAIL:
      return { loading: false, error: action.payload };
    case DELETE_ROOM_RESET:
      return { loading: false, isDeleted: null };
    case CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const roomReviewsReducer = (state = { reviews: [] }, action) => {
  switch (action.type) {
    case GET_REVIEWS_REQUEST:
      return { loading: true };
    case GET_REVIEWS_SUCCESS:
      return { loading: false, reviews: action.payload };
    case GET_REVIEWS_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const deleteReviewReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_REVIEW_REQUEST:
      return { loading: true };
    case DELETE_REVIEW_SUCCESS:
      return { loading: false, isDeleted: action.payload };
    case DELETE_REVIEW_FAIL:
      return { loading: false, error: action.payload };
    case DELETE_REVIEW_RESET:
      return { loading: false, isDeleted: null };
    case CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};
