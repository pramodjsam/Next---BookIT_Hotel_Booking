import { getSession } from "next-auth/client";
import React from "react";
import Layout from "../../components/layout/Layout";
import Profile from "../../components/user/Profile";

const UpdatePage = () => {
  return (
    <Layout>
      <Profile />
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

export default UpdatePage;
