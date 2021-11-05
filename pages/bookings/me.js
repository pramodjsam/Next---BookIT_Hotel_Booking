import { getSession } from "next-auth/client";
import React from "react";
import MyBookings from "../../components/bookings/MyBookings";
import { wrapper } from "../../redux/store";
import Layout from "../../components/layout/Layout";
import { myBookings } from "../../redux/actions/bookingActions";

const MyBookingsPage = () => {
  return (
    <Layout title="My Bookings">
      <MyBookings />
    </Layout>
  );
};

export default MyBookingsPage;

export const getServerSideProps = wrapper.getServerSideProps(
  async ({ req, store }) => {
    const session = await getSession({ req });
    if (!session) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    await store.dispatch(myBookings(req.headers.cookie, req));

    return {
      props: {
        session,
      },
    };
  }
);
