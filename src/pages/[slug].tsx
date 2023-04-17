import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

const ProfilePage: NextPage = () => {
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username: "addania",
  });

  if (isLoading) {
    return <div className="flex h-screen justify-center">Loading...</div>;
  }

  if (!data) {
    return <div className="flex h-screen justify-center">404</div>;
  }

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <main className="flex h-screen justify-center">
        <div>{data.username}</div>
      </main>
    </>
  );
};

export default ProfilePage;
