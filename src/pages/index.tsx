import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

import { api } from "~/utils/api";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";

const CreatePostWizard = () => {
  const { user } = useUser();

  const [input, setInput] = useState("");
  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError;
      console.log("e.data", e.data);
      console.log("YYY errorMessage", errorMessage);
      /* if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);*/ // DOES NOT WORK
      //     } else {
      toast.error("Failed to post! Please try again later.");
      //   }
    },
  });

  if (!user) {
    return null;
  }

  return (
    <div className="flex w-full gap-4 space-x-2 p-4">
      <Image
        src={user.profileImageUrl}
        className="h-10 w-10  rounded-full"
        alt="Profile image"
        width={56}
        height={56}
      />
      <input
        placeholder="Type some emojis :)"
        className="bg-transparent"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
        onKeyDown={(e) => {
          if (e.key === "ENTER") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input });
            }
          }
        }}
      />
      {input !== "" && !isPosting && (
        <button onClick={() => mutate({ content: input })}>Post</button>
      )}
      {isPosting && (
        <div className="flex justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
};

const UserBar = () => {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <div className="flex">
      <Image
        src={user.profileImageUrl}
        className="h-16 w-16  rounded-full"
        alt="Profile image"
        width={56}
        height={56}
      />
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: pageLoading } = api.posts.getAll.useQuery();

  if (pageLoading) {
    return (
      <div className="flex w-full justify-center p-8">
        <LoadingPage />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex w-full justify-center p-8">
        Something went wrong...
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {data.map((fullProps) => (
        <PostView {...fullProps} key={fullProps.post.id} />
      ))}
    </div>
  );
};
const Home: NextPage = () => {
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();

  // Start fetching data early - reactQuery will cache it
  api.posts.getAll.useQuery();

  if (!userLoaded) {
    return <div />;
  }

  return (
    <>
      <Head>
        <title>Chirp</title>
        <meta name="description" content="💭" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <div className="flex border-b border-slate-400 p-4">
          {!isSignedIn && (
            <div className="flex justify-center">
              <SignInButton />
            </div>
          )}
          {!!isSignedIn && (
            <div className="w-full">
              <div className="flex w-full justify-between">
                <div className="flex items-center  space-x-2">
                  <UserBar />
                  <p>Hi {user.fullName}</p>
                </div>
                <SignOutButton />
              </div>
              <CreatePostWizard />
            </div>
          )}
        </div>
        <Feed />
      </PageLayout>
    </>
  );
};

export default Home;
