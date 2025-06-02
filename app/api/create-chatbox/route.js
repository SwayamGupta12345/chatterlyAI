// import { NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";

// export async function POST(req) {

//   // if (!userEmail || !friendEmail) {
//   //   return NextResponse.json({ success: false, message: "Missing user or friend email." }, { status: 400 });
//   // }

//   const { db } = await connectToDatabase();
//   const { userEmail, friendEmail } = await req.json();

//   const existing = await db.collection("chatboxes").findOne({
//     participants: { $all: [userEmail, friendEmail] },
//   });

//   if (existing) {
//     return NextResponse.json({ success: false, message: "Chat already exists." });
//   }

//   const chatbox = {
//     participants: [userEmail, friendEmail],
//     messages: [],
//     lastModified: new Date(),
//   };

//   const result = await db.collection("chatboxes").insertOne(chatbox);
//   const insertedId = result.insertedId;

//   // ✅ Update both users’ frnd_arr with chatbox ID
//   await db.collection("users").updateOne(
//     { email: userEmail },
//     { $addToSet: { frnd_arr: insertedId } }
//   );
//   await db.collection("users").updateOne(
//     { email: friendEmail },
//     { $addToSet: { frnd_arr: insertedId } }
//   );

//   return NextResponse.json({ success: true, chatbox: { ...chatbox, _id: insertedId } });
// }

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  const { db } = await connectToDatabase();
  const { userEmail, friendEmail } = await req.json();

  // Validate input
  if (!userEmail || !friendEmail) {
    return NextResponse.json({ success: false, message: "Missing user or friend email." }, { status: 400 });
  }

  // Check if friend exists
  const friend = await db.collection("users").findOne({ 
    $or: [
      { email: friendEmail },
      { nickname: friendEmail } // in case user entered nickname
    ]
  });

  if (!friend) {
    return NextResponse.json({ success: false, message: "Friend not found." }, { status: 404 });
  }

  const actualFriendEmail = friend.email;

  // Check if chatbox already exists
  const existing = await db.collection("chatboxes").findOne({
    participants: { $all: [userEmail, actualFriendEmail] },
  });

  if (existing) {
    return NextResponse.json({ success: false, message: "Chat already exists." });
  }

  // Create new chatbox
  const chatbox = {
    participants: [userEmail, actualFriendEmail],
    messages: [],
    lastModified: new Date(),
  };

  const result = await db.collection("chatboxes").insertOne(chatbox);
  const insertedId = result.insertedId;

  // Add chatbox to both users' frnd_arr
  await db.collection("users").updateOne(
    { email: userEmail },
    { $addToSet: { frnd_arr: insertedId } }
  );
  await db.collection("users").updateOne(
    { email: actualFriendEmail },
    { $addToSet: { frnd_arr: insertedId } }
  );

  // ✅ Return chatbox and friend info
  return NextResponse.json({
    success: true,
    chatbox: { ...chatbox, _id: insertedId },
    friend: {
      email: friend.email,
      nickname: friend.nickname || "",
    },
  });
}
