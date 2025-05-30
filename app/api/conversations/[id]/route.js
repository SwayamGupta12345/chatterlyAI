import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request, { params }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const conversationId = new ObjectId(params.id)
    const userId = new ObjectId(session.user.id)

    const conversation = await db.collection("conversations").findOne({
      _id: conversationId,
      userId: userId.toString(),
    })

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    return NextResponse.json({ conversation })
  } catch (error) {
    console.error("Get conversation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const conversationId = new ObjectId(params.id)
    const userId = new ObjectId(session.user.id)

    const result = await db.collection("conversations").deleteOne({
      _id: conversationId,
      userId: userId.toString(),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete conversation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

