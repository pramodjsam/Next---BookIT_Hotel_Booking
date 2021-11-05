import React from "react";
import Layout from "../../../components/layout/Layout";
import { getSession } from "next-auth/client";
import AllBookings from "../../../components/admin/AllBookings";

const AllBookingsPage = () => {
  return (
    <Layout title="All Bookings">
      <AllBookings />
    </Layout>
  );
};

export default AllBookingsPage;

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (!session || session.user.role !== "admin") {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
