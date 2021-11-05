import { getSession } from "next-auth/client";
import React from "react";
import AllUsers from "../../../components/admin/AllUsers";
import Layout from "../../../components/layout/Layout";

const AllUsersPage = () => {
  return (
    <Layout title="All Users">
      <AllUsers />
    </Layout>
  );
};

export default AllUsersPage;

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
