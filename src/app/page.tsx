import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

export default function Home() {
    const s = "hey\nhey  https://youtube.com";
    return <Markdown remarkPlugins={[remarkGfm, remarkBreaks]}>{s}</Markdown>;
}
