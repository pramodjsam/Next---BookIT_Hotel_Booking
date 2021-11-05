import axios from "axios";
import {
  ALL_USERS_FAIL,
  ALL_USERS_REQUEST,
  ALL_USERS_SUCCESS,
  CLEAR_ERROR,
  DELETE_USER_FAIL,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  LOAD_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  REGISTER_USER_FAIL,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  RESET_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  UPDATE_PROFILE_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_USER_FAIL,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
} from "../constants/userConstants";

export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_USER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios.post(`/api/auth/register`, userData, config);

    dispatch({
      type: REGISTER_USER_SUCCESS,
    });
  } catch (err) {
    dispatch({
      type: REGISTER_USER_FAIL,
      payload: err.response ? err.response.data.message : err.message,
    });
  }
};

export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.put("/api/me/update", userData, config);

    dispatch({
      type: UPDATE_PROFILE_SUCCESS,
      payload: data.success,
    });
  } catch (err) {
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: err.response ? err.response.data.message : err.message,
    });
  }
};

export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });

    const { data } = await axios.get("/api/me");

    dispatch({
      type: LOAD_USER_SUCCESS,
      payload: data.user,
    });
  } catch (err) {
    dispatch({
      type: LOAD_USER_FAIL,
      payload: err.response ? err.response.data.message : err.message,
    });
  }
};

export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post("/api/password/forgot", email, config);

    dispatch({
      type: FORGOT_PASSWORD_SUCCESS,
      payload: data.message,
    });
  } catch (err) {
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload: err.resposne ? err.response.data.message : err.message,
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERROR });
};

export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch({ type: RESET_PASSWORD_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.put(
      `/api/password/reset/${token}`,
      passwords,
      config
    );

    dispatch({
      type: RESET_PASSWORD_SUCCESS,
      payload: data.success,
    });
  } catch (err) {
    dispatch({
      type: RESET_PASSWORD_FAIL,
      payload: err.response ? err.response.data.message : err.message,
    });
  }
};

export const allUsers = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_USERS_REQUEST });

    const { data } = await axios.get("/api/admin/users");

    dispatch({
      type: ALL_USERS_SUCCESS,
      payload: data.users,
    });
  } catch (err) {
    dispatch({
      type: ALL_USERS_FAIL,
      payload: err.message,
    });
  }
};

export const getUserDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/admin/users/${id}`);

    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data.user,
    });
  } catch (err) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: err.message,
    });
  }
};

export const updateUser = (id, userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_USER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.put(
      `/api/admin/users/${id}`,
      userData,
      config
    );

    dispatch({
      type: UPDATE_USER_SUCCESS,
      payload: data.success,
    });
  } catch (err) {
    dispatch({
      type: UPDATE_USER_FAIL,
      payload: err.message,
    });
  }
};

export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_USER_REQUEST });

    const { data } = await axios.delete(`/api/admin/users/${id}`);

    dispatch({
      type: DELETE_USER_SUCCESS,
      payload: data.success,
    });
  } catch (err) {
    dispatch({
      type: DELETE_USER_FAIL,
      payload: err.message,
    });
  }
};
