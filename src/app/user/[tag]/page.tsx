import User from "@/models/User";
import { redirect } from "next/navigation";
import { getMyId } from "@/lib/auth/me";
import NewPostForm from "./NewPostForm";
import Post from "@/models/Post";
import PostElement from "@/components/Post/Post";
import PostWrapper from "@/components/Post/PostWrapper";
import Feed from "@/components/Feed";

export default async function UserPage({
    params,
}: {
    params: Promise<{ tag: string }>;
}) {
    const { tag } = await params;
    const user = await User.findByTag(tag);
    const isMe = (await getMyId()) === user.id;

    if (user === null) {
        // does not exist
        return redirect("/");
    }

    //const posts = await Post.find({ author: user.id })
    //    .sort({ createdAt: -1 })
    //    .populate<{
    //        author: { name: string; tag: string };
    //   }>("author")
    //    .lean();

    return (
        <>
            <div>
                <p>{user.name}</p>
                <p>@{user.tag}</p>
                <p>Joined on {user.createdAt.toDateString()}</p>
            </div>
            <hr />
            {isMe && <NewPostForm />}
            <hr />
            <Feed userId={user.id} />
        </>
    );
}
