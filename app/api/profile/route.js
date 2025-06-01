// app/api/profile/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
// import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth"; // ✅ ADD THIS
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs"

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const user = await db.collection("users").findOne(
      { email: session.user.email },
      { projection: { password: 0 } }
    )

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (err) {
    console.error("Profile GET error:", err)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, email, pass, nickname } = body

    if (!pass) {
      return NextResponse.json({ message: "Password is required." }, { status: 400 })
    }

    const password = await bcrypt.hash(pass, 10);
    
    const { db } = await connectToDatabase()
    const result = await db.collection("users").updateOne(
      { email: session.user.email },
      { $set: { name, email, password, nickname } }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "No changes made" }, { status: 400 })
    }

    return NextResponse.json({ message: "Profile updated successfully" })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}