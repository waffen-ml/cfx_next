import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getGridFSFile } from "@/lib/fs";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idRaw } = await params;

    if (!mongoose.Types.ObjectId.isValid(idRaw)) {
        return Response.json(
            {
                error: "Invalid id format",
            },
            {
                status: 400,
            }
        );
    }

    const objectId = new mongoose.Types.ObjectId(idRaw);
    const { file, buffer } = await getGridFSFile(objectId);

    if (file === null) {
        return Response.json(
            {
                error: "File not found",
            },
            {
                status: 404,
            }
        );
    }

    return new Response(buffer, {
        headers: {
            "Content-Type": file.metadata?.contentType,
        },
        status: 200,
    });
}
