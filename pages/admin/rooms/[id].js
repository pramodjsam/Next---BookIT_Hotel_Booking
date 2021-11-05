import React from "react";
import { getSession } from "next-auth/client";
import Layout from "../../../components/layout/Layout";
import UpdateRoom from "../../../components/admin/UpdateRoom";

const UpdateRoomPage = () => {
  return (
    <Layout title="All Rooms">
      <UpdateRoom />
    </Layout>
  );
};

export default UpdateRoomPage;

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
