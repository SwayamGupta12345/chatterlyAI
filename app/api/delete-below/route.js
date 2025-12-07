import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { convoId, index } = await req.json();
 
    if (!convoId || index === undefined || !ObjectId.isValid(convoId)) {
      // console.log("Invalid convoId or index:", { convoId, index });
      return NextResponse.json(
        { success: false, message: "Invalid convoId or index" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // 1️⃣ Find the conversation
    const convo = await db
      .collection("conversations")
      .findOne({ _id: new ObjectId(convoId) });

    if (!convo) {
      return NextResponse.json(
        { success: false, message: "Conversation not found" },
        { status: 404 }
      );
    }

    const messagesArray = convo.messages || [];

    if (index < 0 || index >= messagesArray.length) {
      // console.log("Invalid index:", index);
      return NextResponse.json(
        { success: false, message: "Invalid index" },
        { status: 400 }
      );
    }

    // 2️⃣ Identify messages below the given index
    const messagesToDelete = messagesArray.slice(index + 1);

    if (messagesToDelete.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No messages to delete below this index",
      });
    }

    // 3️⃣ Collect all message IDs to remove from the messages collection
    const messageIdsToDelete = messagesToDelete.flatMap((pair) => [
      pair.userMessageId,
      pair.aiResponseId,
    ]);

    // 4️⃣ Remove those message pairs from the conversation
    await db.collection("conversations").updateOne(
      { _id: new ObjectId(convoId) },
      {
        $set: {
          messages: messagesArray.slice(0, index + 1), // keep only messages up to edited index
        },
      }
    );

    // 5️⃣ Delete messages from the messages collection
    await db.collection("messages").deleteMany({
      _id: { $in: messageIdsToDelete.filter(Boolean) },
    });

    return NextResponse.json({
      success: true,
      message: "Deleted all messages below index successfully",
      deletedCount: messageIdsToDelete.length,
    });
  } catch (error) {
    // console.error("Error deleting messages below index:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
