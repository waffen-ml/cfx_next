export default function PostWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full max-w-[500px] min-w-[200px] bg-gray-200 p-1">
            {children}
        </div>
    );
}
