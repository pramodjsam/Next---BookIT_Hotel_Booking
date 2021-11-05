import React from "react";
import Layout from "../../../components/layout/Layout";
import NewRoom from "../../../components/admin/NewRoom";
import { getSession } from "next-auth/client";

const NewRoomPage = () => {
  return (
    <Layout title="New Room">
      <NewRoom />
    </Layout>
  );
};

export default NewRoomPage;

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
