import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { messageId, newText } = await req.json();
    if (!messageId || !newText) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    await db.collection("frnd_msg").updateOne(
      { _id: new ObjectId(messageId) },
      { $set: { text: newText } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
