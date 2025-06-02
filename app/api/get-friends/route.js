import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(req) {
  const { db } = await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) return NextResponse.json({ friends: [] });

  const chatboxes = await db.collection("chatboxes")
    .find({ participants: email })
    .sort({ lastModified: -1 }) // most recent first
    .toArray();

  const friends = chatboxes.map(chat => {
    const friendEmail = chat.participants.find(p => p !== email);
    return {
      chatbox_id: chat._id,
      email: friendEmail,
      nickname: null,
    };
  });

  return NextResponse.json({ friends });
}