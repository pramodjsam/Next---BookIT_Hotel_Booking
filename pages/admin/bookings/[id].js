import React from "react";
import { getSession } from "next-auth/client";
import BookingDetails from "../../../components/bookings/BookingDetails";
import Layout from "../../../components/layout/Layout";
import { getBookingDetails } from "../../../redux/actions/bookingActions";
import { wrapper } from "../../../redux/store";

const BookingDetailsPage = () => {
  return (
    <Layout title="Booking Details">
      <BookingDetails />
    </Layout>
  );
};

export default BookingDetailsPage;

export const getServerSideProps = wrapper.getServerSideProps(
  async ({ req, store, params }) => {
    const session = await getSession({ req });

    if (!session || session.user.role !== "admin") {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    await store.dispatch(getBookingDetails(req.headers.cookie, req, params.id));

    return {
      props: {
        session,
      },
    };
  }
);
