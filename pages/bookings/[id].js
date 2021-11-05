import React from "react";
import Layout from "../../components/layout/Layout";
import BookingDetails from "../../components/bookings/BookingDetails";
import { wrapper } from "../../redux/store";
import { getSession } from "next-auth/client";
import { getBookingDetails } from "../../redux/actions/bookingActions";

const BookingDetailsPage = () => {
  return (
    <Layout>
      <BookingDetails />
    </Layout>
  );
};

export default BookingDetailsPage;

export const getServerSideProps = wrapper.getServerSideProps(
  async ({ req, store, params }) => {
    const session = await getSession({ req });

    if (!session) {
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
