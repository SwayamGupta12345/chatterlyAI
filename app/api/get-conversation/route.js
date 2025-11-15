import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try { 
    const { searchParams } = new URL(req.url);
    const convoId = searchParams.get("convoId");

    if (!convoId || !ObjectId.isValid(convoId)) {
      return NextResponse.json(
        { error: "Invalid or missing convoId" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const conversation = await db.collection("conversations").findOne({
      _id: new ObjectId(convoId),
    });

    if (!conversation || !conversation.messages?.length) {
      return NextResponse.json({ messages: [] }, { status: 200 });
    }

    const messages = await Promise.all(
      conversation.messages.map(async ({ userMessageId, aiResponseId }) => {
        const userMsg = await db
          .collection("messages")
          .findOne({ _id: new ObjectId(userMessageId) });
        const aiMsg = await db
          .collection("messages")
          .findOne({ _id: new ObjectId(aiResponseId) });

        return {
         user: {
            id: userMsg?._id?.toString() || null,
            text: userMsg?.text || "[Missing User Message]",
            isImg: userMsg?.isImg ?? false,
            imageUrl: userMsg?.imageUrl ?? null,
          },
          ai: {
            id: aiMsg?._id?.toString() || null,
            text: aiMsg?.text || "[Missing AI Response]",
            isImg: aiMsg?.isImg ?? false,
            imageUrl: aiMsg?.imageUrl ?? null,
          },
        };
      })
    );

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
