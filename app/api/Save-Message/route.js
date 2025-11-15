// // app/api/save-message/route.js
// export const runtime = 'nodejs';

// import { NextResponse } from 'next/server';
// import { connectToDatabase } from '@/lib/mongodb'; //  ensure path is correct
// import { ObjectId } from 'mongodb';

// export async function POST(req) {
//   try {
//     const { senderName, text, role } = await req.json();

//     if (!senderName || !text || !role) {
//       return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
//     }

//     const { db } = await connectToDatabase();

//     const result = await db.collection('messages').insertOne({
//       senderName,
//       text,
//       role,
//       timestamp: new Date()
//     });

//     return NextResponse.json({ insertedId: result.insertedId });
//   } catch (error) {
//     console.error('Error in /api/save-message:', error);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }
// app/api/save-message/route.js
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const {
      senderName,
      text,
      role,
      isImg = false,
      image = null,
    } = await req.json();

    if (!senderName || !text || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    let imageUrl = null;
    // ⬇️ Upload only if it's an image
    if (isImg && image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        folder: "chat_images",
      });
      imageUrl = uploadRes.secure_url;
    }

    const result = await db.collection("messages").insertOne({
      senderName,
      text,
      role,
      isImg, // 🔥 store image flag
      imageUrl, // 🔥 store base64 image
      timestamp: new Date(),
    });

    return NextResponse.json({ insertedId: result.insertedId });
  } catch (error) {
    console.error("Error in /api/save-message:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
