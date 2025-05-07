import User from "@/models/User";

export default async function AllUsers() {
    const users = await User.find().lean();

    return (
        <>
            <h1>CoffeeTox3 Users:</h1>
            <ul className="list-disc list-inside">
                {users.map((user) => (
                    <li key={user._id.toString()}>
                        {user.name} [tag={user.tag}, email={user.email}, role=
                        {user.role}, joinDate=
                        {user.createdAt.toDateString()}]
                    </li>
                ))}
            </ul>
        </>
    );
}
