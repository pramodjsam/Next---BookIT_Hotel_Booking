import React from "react";
import Layout from "../../../components/layout/Layout";
import { getSession } from "next-auth/client";
import RoomReviews from "../../../components/admin/RoomReviews";

const AllReviewsPage = () => {
  return (
    <Layout title="All Reviews">
      <RoomReviews />
    </Layout>
  );
};

export default AllReviewsPage;

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
