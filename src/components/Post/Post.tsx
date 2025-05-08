import { IPost } from "@/models/Post";
import { IUser } from "@/models/User";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

type PostData = IPost & { author: IUser };

export default function Post({ post }: { post: PostData }) {
    return (
        <div className="flex flex-col gap-1">
            <div>
                <p>{post.author.name}</p>
            </div>
            <p>
                {post.author.name} @{post.author.tag}
            </p>
            <Markdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                {post.body}
            </Markdown>
        </div>
    );
}
