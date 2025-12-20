// import { NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";

// export async function POST(req) {
//   const { db } = await connectToDatabase();

//   const { senderEmail, chatboxId, text } = await req.json();

//   const message = {
//     _id: new ObjectId(),
//     senderEmail,
//     text,
//     timestamp: new Date(),
//   };

//   const result = await db.collection("chatboxes").updateOne(
//     { _id: new ObjectId(chatboxId) },
//     {
//       $push: { messages: message },
//       $set: { lastModified: new Date() }
//     });

//   if (result.matchedCount === 0) {
//     return NextResponse.json({ error: "Chatbox not found" }, { status: 404 });
//   }
//   return NextResponse.json({ message });
// }

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  const { db } = await connectToDatabase();

  const { senderEmail, roomId, text } = await req.json();

  // 1. Create the message with a unique _id
  const message = {
    _id: new ObjectId(),
    senderEmail,
    text,
    timestamp: new Date(),
  };

  try {
    // 2. Insert the full message into the 'frnd_msg' collection
    await db.collection("frnd_msg").insertOne(message);

    // 3. Push only the _id of the message into chatbox's messages array
    const result = await db.collection("chatboxes").updateOne(
      { _id: new ObjectId(roomId) },
      {
        $push: { messages: message._id },
        $set: { lastModified: new Date() },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Chatbox not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      messageId: message._id
    });

  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
