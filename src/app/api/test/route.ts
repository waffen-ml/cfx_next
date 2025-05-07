import User from "@/models/User";

export async function GET() {
    const result = await User.find();
    const res2 = await User.findByTag("1");

    console.log(res2);

    return Response.json({
        users: result.map((r) => r.getDTO()),
    });
}
