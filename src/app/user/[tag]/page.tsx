import User from "@/models/User";
import { redirect } from "next/navigation";
import { getMyId } from "@/lib/auth/me";
import NewPostForm from "./NewPostForm";
import Post from "@/models/Post";

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

    const posts = await Post.find({ authorId: user.id })
        .populate("authorId")
        .exec();

    console.log(posts);

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
            <div>
                {posts.map((post) => (
                    <div key={post.id}>
                        <p></p>
                        <p>{post.body}</p>
                    </div>
                ))}
            </div>
        </>
    );
}
