import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { convoId } = await req.json();
    if (!convoId)
      return NextResponse.json({ error: "Missing convoId" }, { status: 400 });

    const { db } = await connectToDatabase();

    await db.collection("chats").updateOne(
      { convoId: new ObjectId(convoId) }, // 🔥 wrap with ObjectId
      { $set: { lastModified: new Date() } }
    );
 
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error updating lastModified:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
