// import { NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";

// export async function POST(req) {
//   try {
//     const { target, convoId } = await req.json();

//     if (!target || !convoId) {
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });
//     }

//     // Destructure db from connectToDatabase()
//     const { db } = await connectToDatabase();

//     const usersCollection = db.collection("users");
//     const chatsCollection = db.collection("chats");

//     // 1. Find user by email or nickname
//     const targetUser = await usersCollection.findOne({
//       $or: [{ email: target }, { nickname: target }],
//     });

//     if (!targetUser) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // 2. Find chat by convoId (assuming convoId is a string representation of ObjectId)
//     const chatDoc = await chatsCollection.findOne({
//       convoId: new ObjectId(convoId),
//     });

//     if (!chatDoc) {
//       return NextResponse.json({ error: "Chat not found" }, { status: 404 });
//     }

//     const chatId = chatDoc._id;

//     // 3. Update chat owners if not already added
//     await chatsCollection.updateOne(
//       { _id: chatId },
//       {
//         $addToSet: {
//           owners: new ObjectId(targetUser._id),
//         },
//       }
//     );

//     // 4. Update user chat array
//     await usersCollection.updateOne(
//       { _id: new ObjectId(targetUser._id) },
//       {
//         $addToSet: {
//           chats_arr: chatId,
//         },
//       }
//     );

//     return NextResponse.json({ message: "Chat shared successfully" }, { status: 200 });
//   } catch (err) {
//     console.error("Share Error:", err);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import axios from "axios"; // ⬅️ add this line

export async function POST(req) {
  try {
    const { target, convoId } = await req.json();

    if (!target || !convoId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection("users");
    const chatsCollection = db.collection("chats");

    const targetUser = await usersCollection.findOne({
      $or: [{ email: target }, { nickname: target }],
    });

    if (!targetUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const chatDoc = await chatsCollection.findOne({
      convoId: new ObjectId(convoId),
    });

    if (!chatDoc)
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });

    const chatId = chatDoc._id;

    // Update ownership
    await chatsCollection.updateOne(
      { _id: chatId },
      { $addToSet: { owners: new ObjectId(targetUser._id) } }
    );

    await usersCollection.updateOne(
      { _id: new ObjectId(targetUser._id) },
      { $addToSet: { chats_arr: chatId } }
    );

    // ✅ NEW PART — Notify Socket Server
    try {
      await axios.post("https://chatterly-backend-2.onrender.com/emit-share", {
        targetEmail: targetUser.email,
        chatbox: {
          _id: chatDoc._id,
          name: chatDoc.name || "Shared Chat",
          convoId: chatDoc.convoId.toString(),
        },
      });
    } catch (socketErr) {
      console.error("Socket notify failed:", socketErr.message);
    }

    return NextResponse.json(
      { message: "Chat shared successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Share Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}