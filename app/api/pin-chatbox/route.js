import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { db } = await connectToDatabase();
    const { userEmail, chatboxId } = await req.json();

    if (!userEmail || !chatboxId)
      return NextResponse.json({ success: false, message: "Missing parameters" }, { status: 400 });

    const chatObjectId = new ObjectId(chatboxId);

    // Toggle pinned field
    const chatbox = await db.collection("chatboxes").findOne({ _id: chatObjectId });
    const newPinnedState = !chatbox?.pinned;

    await db.collection("chatboxes").updateOne(
      { _id: chatObjectId },
      { $set: { pinned: newPinnedState, lastModified: new Date() } }
    );

    return NextResponse.json({
      success: true,
      message: newPinnedState ? "Chat pinned to top." : "Chat unpinned.",
    });
  } catch (error) {
    console.error("Error pinning chatbox:", error);
    return NextResponse.json({ success: false, message: "Server error while pinning chat." }, { status: 500 });
  }
}
