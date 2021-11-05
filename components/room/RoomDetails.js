import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Head from "next/head";
import { useRouter } from "next/router";
import { Carousel } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { clearErrors } from "../../redux/actions/roomActions";
import Image from "next/image";
import RoomFeatures from "./RoomFeatures";
import axios from "axios";
import {
  checkBooking,
  getBookedDates,
} from "../../redux/actions/bookingActions";
import { CHECK_BOOKING_RESET } from "../../redux/constants/bookingConstants";
import getStripe from "../../utils/getStripe";
import NewReview from "../reviews/NewReview";
import ListReviews from "../reviews/ListReviews";

const RoomDetails = () => {
  const [checkInDate, setCheckInDate] = useState();
  const [checkOutDate, setCheckOutDate] = useState();
  const [daysOfStay, setDaysOfStay] = useState();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const { room, error } = useSelector((state) => state.roomDetails);
  const { loading: bookingLoading, available } = useSelector(
    (state) => state.checkBooking
  );
  const { user } = useSelector((state) => state.loadUser);
  const { dates } = useSelector((state) => state.bookedDates);

  let excludedDates = [];

  dates.forEach((date) => {
    excludedDates.push(new Date(date));
  });

  useEffect(() => {
    dispatch(getBookedDates(id));

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    return () => {
      dispatch({ type: CHECK_BOOKING_RESET });
    };
  }, [dispatch, id, error]);

  const onChangeHandler = (dates) => {
    const [start, end] = dates;

    setCheckInDate(start);
    setCheckOutDate(end);
  };

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const days =
        Math.floor(new Date(checkOutDate) - new Date(checkInDate)) /
          (1000 * 60 * 60 * 24) +
        1;
      setDaysOfStay(days);

      dispatch(checkBooking(id, checkInDate, checkOutDate));
    }
  }, [checkInDate, checkOutDate]);

  const newBookingHandler = async () => {
    const bookingDate = {
      room: router.query.id,
      checkInDate,
      checkOutDate,
      daysOfStay,
      amountPaid: 90,
      paymentInfo: {
        id: "STRIPE_ID",
        status: "STRIPE_STATUS",
      },
    };

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post("/api/bookings", bookingDate, config);

      // console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const bookRoom = async (id, pricePerNight) => {
    setPaymentLoading(true);
    const amount = pricePerNight * daysOfStay;

    try {
      const link = `/api/checkout_session/${id}?checkInDate=${checkInDate.toISOString()}&checkOutDate=${checkOutDate.toISOString()}&daysOfStay=${daysOfStay}`;
      const { data } = await axios.get(link, { params: { amount } });
      const stripe = await getStripe();

      stripe.redirectToCheckout({ sessionId: data.id });

      setPaymentLoading(false);
    } catch (err) {
      setPaymentLoading(false);
      console.log(err);
      toast.error(err.message);
    }
  };

  return (
    <>
      <Head>
        <title>{room.name} - BookIT</title>
      </Head>
      <div className="container container-fluid">
        <h2 className="mt-5">{room.name}</h2>
        <p>{room.address}</p>

        <div className="ratings mt-auto mb-3">
          <div className="rating-outer">
            <div
              className="rating-inner"
              style={{ width: `${(room.ratings / 5) * 100}%` }}
            ></div>
          </div>
          <span id="no_of_reviews">({room.numReviews} Reviews)</span>
        </div>

        <Carousel hover="pause">
          {room.images &&
            room.images.map((image) => (
              <Carousel.Item key={image.public_id}>
                <div style={{ width: "100%", height: "440px" }}>
                  <Image
                    className="d-block m-auto"
                    src={image.url}
                    alt={room.name}
                    layout="fill"
                  />
                </div>
              </Carousel.Item>
            ))}
        </Carousel>

        <div className="row my-5">
          <div className="col-12 col-md-6 col-lg-8">
            <h3>Description</h3>
            <p>{room.description}</p>

            <RoomFeatures room={room} />
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <div className="booking-card shadow-lg p-4">
              <p className="price-per-night">
                <b>${room.pricePerNight}</b> / night
              </p>
              <hr />
              <p className="mt-5 mb-3">Pick Check In & Check Out Date</p>
              <DatePicker
                className="w-100"
                selected={checkInDate}
                onChange={onChangeHandler}
                startDate={checkInDate}
                endDate={checkOutDate}
                minDate={new Date()}
                selectsRange
                inline
                excludeDates={excludedDates}
              />

              {available === true && (
                <div className="alert alert-success my-3 font-weight-bold">
                  Room is available. Book Now
                </div>
              )}

              {available === false && (
                <div className="alert alert-danger my-3 font-weight-bold">
                  Room is not available. Try different date
                </div>
              )}

              {available && !user ? (
                <div className="alert alert-danger my-3 font-weight-bold">
                  Login to book room
                </div>
              ) : (
                <button
                  className="btn btn-block py-3 booking-btn"
                  onClick={() => bookRoom(id, room.pricePerNight)}
                  disabled={bookingLoading || paymentLoading ? true : false}
                >
                  Pay - ${daysOfStay ? daysOfStay * room.pricePerNight : 0}
                </button>
              )}

              {/* <button
                className="btn btn-block py-3 booking-btn"
                onClick={newBookingHandler}
              >
                Pay
              </button> */}
            </div>
          </div>
        </div>

        <NewReview />

        {room.reviews && room.reviews.length > 0 ? (
          <ListReviews reviews={room.reviews} />
        ) : (
          <p>
            <b>No Reviews for this room.</b>
          </p>
        )}
      </div>
    </>
  );
};

export default RoomDetails;
