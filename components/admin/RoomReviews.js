import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { MDBDataTable } from "mdbreact";
import Loader from "../layout/Loader";
import {
  clearErrors,
  deleteReview,
  getRoomReviews,
} from "../../redux/actions/roomActions";
import { useRouter } from "next/router";
import ButtonLoader from "../layout/ButtonLoader";
import { DELETE_REVIEW_RESET } from "../../redux/constants/roomConstants";

const RoomReviews = () => {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const { reviews, error, loading } = useSelector((state) => state.roomReviews);
  const {
    isDeleted,
    error: deleteReviewError,
    loading: deleteReviewLoading,
  } = useSelector((state) => state.deleteReview);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteReviewError) {
      toast.error(deleteReviewError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("Review deleted successfully");
      dispatch(getRoomReviews(roomId));
      dispatch({ type: DELETE_REVIEW_RESET });
    }
  }, [dispatch, error, deleteReviewError, isDeleted]);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(getRoomReviews(roomId));
  };

  const setReviews = () => {
    const data = {
      columns: [
        {
          label: "Review ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Rating",
          field: "rating",
          sort: "asc",
        },
        {
          label: "Comment",
          field: "comment",
          sort: "asc",
        },
        {
          label: "User",
          field: "user",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };

    reviews &&
      reviews.forEach((review) => {
        data.rows.push({
          id: review._id,
          rating: review.rating,
          comment: review.comment,
          user: review.name,
          actions: (
            <>
              <button
                className="btn btn-danger mx-2"
                onClick={() => deleteReviewHandler(review._id)}
              >
                <i className="fa fa-trash"></i>
              </button>
            </>
          ),
        });
      });

    return data;
  };

  const deleteReviewHandler = (id) => {
    dispatch(deleteReview(id, roomId));
  };

  return (
    <div className="container container-fluid">
      <div className="row justify-content-center mt-5">
        <div className="col-5">
          <form onSubmit={submitHandler}>
            <div className="form-group">
              <label htmlFor="roomId_field">Enter Room ID</label>
              <input
                type="roomId"
                id="roomId_field"
                className="form-control"
                name="roomId"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
            </div>
            <button
              id="forgot_password_button"
              type="submit"
              className="btn btn-block py-3"
              disabled={loading ? true : false}
            >
              {loading ? <ButtonLoader /> : `Search`}
            </button>
          </form>
        </div>
      </div>

      {reviews && reviews.length > 0 ? (
        <>
          <h1 className="my-5">{reviews && reviews.length} Reviews</h1>
          <MDBDataTable
            data={setReviews()}
            className="px-3"
            bordered
            striped
            hover
          />
        </>
      ) : !loading || !deleteReviewLoading ? (
        <div className="alert alert-danger mt-5 text-center">
          No Reviews Found
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default RoomReviews;
