import { NextResponse } from "next/server"
import { getSession } from "next-auth/react"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const userId = session.user.id

    // Get conversation statistics
    const conversations = await db.collection("conversations").find({ userId }).toArray()

    const totalConversations = conversations.length
    const totalMessages = conversations.length // Each conversation has one message in our current schema

    // Calculate average messages per conversation
    const averageMessagesPerConversation = totalConversations > 0 ? totalMessages / totalConversations : 0

    // Get recent conversations
    const recentConversations = await db
      .collection("conversations")
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(5)
      .toArray()
      .then((convs) =>
        convs.map((conv) => ({
          id: conv._id.toString(),
          title: conv.message.substring(0, 30) + (conv.message.length > 30 ? "..." : ""),
          date: new Date(conv.timestamp).toLocaleDateString(),
          messageCount: 1, // Each conversation has one message in our current schema
        })),
      )

    return NextResponse.json({
      totalConversations,
      totalMessages,
      averageMessagesPerConversation,
      recentConversations,
    })
  } catch (error) {
    console.error("Get stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

