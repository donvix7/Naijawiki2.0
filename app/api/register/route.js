import { NextResponse } from "next/server";

export async function POST(request) {
    const {} = await request.json();
    await User.create({});
    return NextResponse.json(null, { status: 201 });
}