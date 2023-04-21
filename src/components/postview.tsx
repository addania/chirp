import Image from "next/image";

import dayjs from "dayjs";

import type { RouterOutputs } from "~/utils/api";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div
      key={post.id}
      className="flex items-center gap-4 border-b border-slate-400 p-8"
    >
      <Image
        src={author.profilePicture}
        alt="Author image"
        className="h-12 w-12  rounded-full"
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex gap-2 text-slate-400">
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span>{`•  ${dayjs(post.createdAt).fromNow()}`}</span>
          </Link>
        </div>
        <div className="flex">{post.content}</div>
      </div>
    </div>
  );
};
