"use client";
import { Inter } from "next/font/google";
import { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Lightbulb,
  Menu,
  X,
  User,
  LogOut,
  ArrowLeft,
  Send,
  LayoutDashboard,
  MessageCircleMore,
  Bell,
  MessageSquareDiff,
  Share,
  Lock,
} from "lucide-react";
import { MdDelete } from "react-icons/md";
import { RiEditLine } from "react-icons/ri";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLayoutEffect, Suspense } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaCopy, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { getSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React from "react";
import { io } from "socket.io-client";

export default function AskDoubtClient() {
  const searchParams = useSearchParams();
  const convoId = searchParams.get("convoId") || "No convoId";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [user_ai_chats, setUser_ai_chats] = useState([]);
  const [showShare, setShowShare] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const socket = useRef(null);
  // const searchParams = useSearchParams();
  // const convoId = searchParams.get("convoId");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();
  const handleCopy = (text) => navigator.clipboard.writeText(text);
  const sendToWhatsApp = (text) =>
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
  const sendToGmail = (text) => {
    const subject = encodeURIComponent("Chatterly");
    const body = encodeURIComponent(text);
    const gmailUrl = `https://mail.google.com/mail/u/0/?fs=1&to=&su=${subject}&body=${body}&tf=cm`;
    window.open(gmailUrl, "_blank");
  };

  // ✅ Get email from localStorage
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      } else {
        setMessages([
          {
            role: "bot",
            text: "⚠️ Please log in again. User session is missing.",
          },
        ]);
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    const fetchUserChats = async () => {
      try {
        const res = await fetch("/api/fetch-ai-chats");
        const data = await res.json();
        if (res.ok) {
          setUser_ai_chats(data.chats); // or whatever state you use to render sidebar/chat list
        } else {
          console.error("Error loading chats:", data.message);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };

    fetchUserChats();
  }, []);

  // useEffect(() => {
  //   const handleGlobalKeydown = (e) => {
  //     const isAllowed = /^[a-zA-Z0-9 ]$/.test(e.key)
  //     if (isAllowed && document.activeElement !== inputRef.current) {
  //       e.preventDefault()
  //       inputRef.current?.focus()

  //       // Append the key to the input manually
  //       setInput((prev) => prev + e.key)
  //     }
  //   }

  //   window.addEventListen]er("keydown", handleGlobalKeydown)

  //   return () => {
  //     window.removeEventListener("keydown", handleGlobalKeydown)
  //   }
  // }, [])
  useEffect(() => {
    if (!convoId) return;

    const fetchConversation = async () => {
      try {
        const res = await fetch(`/api/get-conversation?convoId=${convoId}`);
        if (!res.ok) return;
        const data = await res.json();

        const formatted = data.messages.flatMap((pair) => [
          {
            id: pair.user?.id || null,
            text: pair.user?.text || "[Missing User Message]",
            role: "user",
          },
          {
            id: pair.ai?.id || null,
            text: pair.ai?.text || "[Missing AI Response]",
            role: "ai",
          },
        ]);

        setMessages(
          formatted.length > 0
            ? formatted
            : [{ text: "Start A Conversation", from: "system" }]
        );
      } catch (err) {
        console.error("Failed to load conversation", err);
        setMessages([{ text: "Start A Conversation", from: "system" }]);
      }
    };

    fetchConversation();
  }, [convoId]);


  const sendMessage = async () => {
    if (!input.trim()) return;

    if (!userEmail) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "❗ Please login to use chat." },
      ]);
      return;
    }

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      // 1. Save user message via API
      const userRes = await fetch("/api/Save-Message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderName: userEmail,
          text: input,
          role: "user",
        }),
      });
      const { insertedId: userMessageId } = await userRes.json();

      // 2. Get AI response
      const aiRes = await axios.post("https://askdemia1.onrender.com/chat", {
        user_id: userEmail,
        message: input,
      });

      const aiText = aiRes?.data?.response || "Unexpected response format.";
      const aiMessage = { role: "bot", text: aiText };
      setMessages((prev) => [...prev, aiMessage]);
      console.log("ai res genet=rated")
      // 3. Save AI response via API
      const aiSave = await fetch("/api/Save-Message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderName: "AI",
          text: aiText,
          role: "ai",
        }),
      });
      console.log("Response saved");
      const { insertedId: aiResponseId } = await aiSave.json();

      // 4. Save message pair to conversation
      await fetch("/api/add-message-pair", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          convoId,
          userMessageId,
          aiResponseId,
        }),
      });
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Something went wrong. Try again.");
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Server error. Please try again later." },
      ]);
    }

    setLoading(false);
  };

  const handleNewChat = async () => {
    const res = await fetch("/api/create-new-chat", { method: "POST" });
    const data = await res.json();

    if (res.ok) {
      // redirect to ask-doubt with convoId as query param
      router.push(`/ask-doubt?convoId=${data.convoId}`);
    } else {
      alert(data.message || "Failed to create chat");
    }
  };

  const handleSendShare = async () => {
    console.log("hit happened");

    if (!selectedUser) return alert("Select a user is set.");

    try {
      const res = await fetch("/api/share-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: selectedUser.email || selectedUser.nickname,
          convoId,
          message: shareMessage, // include message here
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Share failed");

      alert("Chat shared successfully!");
      setShowShare(false);
      setSearchQuery("");
      setSearchResults([]);
      setSelectedUser("");
      setShareMessage("");
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    }
  };
  const handleEditMessage = (id) => {
    const msg = messages.find((m) => m.id === id); // or m._id depending on your data shape
    if (!msg) return;

    setEditingIndex(id); // Now storing the actual ID
    setEditingText(msg.text);
  };


  // 1. Duplicated sendMessage logic, renamed to resendEditedMessage
  const resendEditedMessage = async (text) => {
    if (!text.trim()) return;

    if (!userEmail) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "❗ Please login to use chat." },
      ]);
      return;
    }

    const userMessage = { role: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      // Save user message
      const userRes = await fetch("/api/Save-Message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderName: userEmail,
          text,
          role: "user",
        }),
      });
      const { insertedId: userMessageId } = await userRes.json();

      // Get AI response
      const aiRes = await axios.post("https://askdemia1.onrender.com/chat", {
        user_id: userEmail,
        message: text,
      });

      const aiText = aiRes?.data?.response || "Unexpected response format.";
      const aiMessage = { role: "bot", text: aiText };
      setMessages((prev) => [...prev, aiMessage]);

      // Save AI response
      const aiSave = await fetch("/api/Save-Message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderName: "AI",
          text: aiText,
          role: "ai",
        }),
      });

      const { insertedId: aiResponseId } = await aiSave.json();

      // Save message pair
      await fetch("/api/add-message-pair", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          convoId,
          userMessageId,
          aiResponseId,
        }),
      });
    } catch (err) {
      console.error("Error resending message:", err);
      setError("Something went wrong. Try again.");
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Server error. Please try again later." },
      ]);
    }

    setLoading(false);
  };

  // 2. Updated confirmEditMessage
  const confirmEditMessage = async () => {
    if (!editingText.trim()) return;

    try {
      const res = await fetch("/api/edit-ai-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId: editingIndex,
          convoId,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === editingIndex ? { ...msg, text: editingText } : msg
          )
        );
        setEditingIndex(null);
        // Send it as a new message flow
        await resendEditedMessage(editingText);
      } else {
        alert("Edit failed: " + result.message);
      }
    } catch (err) {
      console.error("Error editing message:", err);
      alert("Something went wrong.");
    }

    setEditingIndex(null);
    setEditingText("");
  };

  const handleDeleteMessage = async (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));

    await fetch('/api/delete-ai-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messageId: id,
        convoId: convoId,
      }),
    });
    console.log("deleted completely");
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      router.push("/login"); // Or "/"
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Suspense fallback={null}>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 relative">
        {/* Sidebar */}
        <div
          className={`fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-md border-r border-white/20 z-50 transform transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Chatterly
                </span>
              </div>

              {/* Close button pushed to the right */}
              <div className="flex-1 flex justify-end lg:hidden">
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 hover:bg-gray-200 rounded-md"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <nav className="space-y-2">
              <Link
                href="/dashboard"
                className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/ask-doubt"
                className="flex items-center space-x-3 px-4 py-3 bg-purple-100 text-purple-700 rounded-xl"
              >
                <Lightbulb className="w-5 h-5" />
                <span>Chatbot</span>
              </Link>
              <Link
                href="/chat"
                className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <MessageCircleMore className="w-5 h-5" />
                <span>Chat with Friends</span>
              </Link>
              <hr className="border-t-2 border-gray-400 rounded-full my-4 shadow-sm" />
              <button
                onClick={handleNewChat}
                className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors w-full"
              >
                <MessageSquareDiff className="w-5 h-5" />
                <span>New Chat</span>
              </button>
              {/* Dynamically list previous AI chats */}
              <div className="space-y-1 mt-4 px-2">
                {user_ai_chats.length > 0 ? (
                  user_ai_chats.map((chat) => (
                    <Link
                      key={chat._id}
                      href={`/ask-doubt?convoId=${chat.convoId}`}
                      className="block text-sm px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {chat.name || "Untitled Chat"}
                    </Link>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 px-4 italic">
                    No previous chats
                  </p>
                )}
              </div>
            </nav>
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Section */}
        <div className="flex flex-col flex-1 lg:ml-64">
          {/* Header */}
          <header className="bg-white/70 backdrop-blur-md border-b border-white/20 px-6 py-4 sticky top-0 z-20">
            <div className="flex items-center justify-between">
              {/* Left section: Menu toggle + Heading + Back Link */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors z-100"
                >
                  {isSidebarOpen ? (
                    <X className="w-6 h-6 " />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
                <Link
                  href="/dashboard"
                  className="flex items-center text-purple-600 hover:text-purple-700 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Chatbot</h1>
              </div>

              {/* Right section: Notification + Profile */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowShare(true)}
                  className="flex items-center border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Share className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="hidden sm:inline">Share</span>
                </button>

                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                  <Bell className="w-6 h-6 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
                <Link href="/profile">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center cursor-pointer">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </Link>
              </div>
            </div>
          </header>
          {showShare && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-sm relative">
                {/* Close Button */}
                <button
                  onClick={() => setShowShare(false)}
                  className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-md"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* Title */}
                <h2 className="text-lg font-semibold mb-4">Share this page</h2>

                {/* Add people */}
                <label className="block text-sm font-medium mb-1">
                  Add people and groups
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedUser({ email: e.target.value }); // ← directly set selected user
                  }}
                  placeholder="Enter email or nickname"
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm mb-4"
                />

                {/* Message */}
                <textarea
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                  placeholder="Message"
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm mb-4"

                  rows={3}
                />

                {/* General Access */}
                <div className="text-xs text-gray-600 mb-2">General access</div>
                <div className="flex items-center gap-2 text-sm text-gray-700 mb-4">
                  <Lock className="w-4 h-4 text-gray-500" />
                  <span>
                    Restricted — Only people with access can open with the link
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowShare(false)}
                    className="text-sm text-gray-600 hover:underline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendShare}
                    className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  // disabled={!selectedUser}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Chat Body */}
          <div className="p-6">
            <h1 className="text-xl font-bold mb-4">
              Chat: {convoId || "No convo selected"}
            </h1>
            {/* render your chat UI using messages */}
          </div>
          <main className="flex-1 relative overflow-x-hidden">
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 pb-32">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                  >
                    <div
                      className={`px-4 py-3 rounded-xl shadow-md break-words ${msg.role === "user"
                        ? "bg-purple-100 text-right rounded-br-none self-end  max-w-[70%] sm:max-w-md"
                        : "bg-blue-100 text-left rounded-bl-none self-start max-w-[90%] sm:max-w-2xl overflow-x-auto"
                        }`}
                    >
                      <div className="text-xs font-semibold mb-1">
                        {msg.role === "user" ? "You" : "Bot"}
                      </div>

                      <div className="markdown-content text-sm text-gray-800 overflow-x-hidden">
                        <div className="min-w-full">
                          {editingIndex === msg.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                className="w-full p-2 border rounded"
                                rows={2}
                              />
                              <div className="flex justify-end gap-2 text-sm">
                                <button
                                  onClick={confirmEditMessage}
                                  className="text-green-600 hover:underline"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingIndex(null);
                                    setEditingText("");
                                  }}
                                  className="text-gray-600 hover:underline"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({ children }) => <p>{children}</p>,
                                a: ({ href, children }) => (
                                  <a
                                    href={href}
                                    style={{
                                      color: "#6cf",
                                      textDecoration: "underline",
                                    }}
                                  >
                                    {children}
                                  </a>
                                ),
                                li: ({ children }) => <li>{children}</li>,
                                code: ({ inline, children }) =>
                                  inline ? (
                                    <code
                                      style={{
                                        backgroundColor: "#333",
                                        padding: "2px 6px",
                                        borderRadius: "4px",
                                      }}
                                    >
                                      {children}
                                    </code>
                                  ) : (
                                    <div
                                      style={{
                                        position: "relative",
                                        marginBottom: "1rem",
                                      }}
                                    >
                                      <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto text-sm">
                                        <code>
                                          {typeof children === "string"
                                            ? children
                                            : Array.isArray(children)
                                              ? children.join("")
                                              : ""}
                                        </code>
                                      </pre>
                                      <div
                                        style={{
                                          position: "absolute",
                                          top: 6,
                                          right: 8,
                                          display: "flex",
                                          gap: "8px",
                                        }}
                                      >
                                        <button
                                          onClick={() =>
                                            handleCopy(
                                              Array.isArray(children)
                                                ? children.join("")
                                                : children
                                            )
                                          }
                                          title="Copy"
                                          className="action-button"
                                          style={{
                                            background: "none",
                                            color: "white",
                                            border: "none",
                                            cursor: "pointer",
                                          }}
                                        >
                                          <FaCopy />
                                        </button>
                                        <button
                                          onClick={() => sendToWhatsApp(children)}
                                          title="Share via WhatsApp"
                                          className="action-button"
                                          style={{
                                            background: "none",
                                            color: "white",
                                            border: "none",
                                            cursor: "pointer",
                                          }}
                                        >
                                          <FaWhatsapp />
                                        </button>
                                        <button
                                          onClick={() => sendToGmail(children)}
                                          title="Send via Email"
                                          className="action-button"
                                          style={{
                                            background: "none",
                                            color: "white",
                                            border: "none",
                                            cursor: "pointer",
                                          }}
                                        >
                                          <FaEnvelope />
                                        </button>
                                      </div>
                                    </div>
                                  ),
                                table: ({ children }) => (
                                  <div style={{ overflowX: "auto" }}>
                                    <table className="min-w-[500px] table-auto border border-gray-400 text-sm">
                                      {children}
                                    </table>
                                  </div>
                                ),
                                thead: ({ children }) => (
                                  <thead style={{ backgroundColor: "#e5e7eb" }}>
                                    {children}
                                  </thead>
                                ),
                                tbody: ({ children }) => (
                                  <tbody>{children}</tbody>
                                ),
                                tr: ({ children }) => (
                                  <tr style={{ borderBottom: "1px solid #888" }}>
                                    {children}
                                  </tr>
                                ),
                                th: ({ children }) => (
                                  <th className="border border-gray-400 bg-gray-200 px-4 py-2 text-left font-medium">
                                    {children}
                                  </th>
                                ),
                                td: ({ children }) => (
                                  <td className="border border-gray-300 px-4 py-2 text-left">
                                    {children}
                                  </td>
                                ),
                              }}
                              supresshydration
                            >
                              {msg.text}
                            </ReactMarkdown>
                          )}</div>
                        {msg.text && (
                          <div className="flex gap-4 justify-end items-center mt-2 text-xs text-gray-700">
                            <button
                              onClick={() => handleEditMessage(msg.id)}
                              title="Edit message"
                              className="flex items-center gap-1 text-blue-600 hover:underline"
                            >
                              <RiEditLine />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              title="Delete message"
                              className="flex items-center gap-1 text-red-600 hover:underline"
                            >
                              <MdDelete />
                              <span>Delete</span>
                            </button>
                            <button
                              onClick={() => handleCopy(msg.text)}
                              title="Copy message"
                              className="flex items-center gap-1 text-gray-600 hover:text-purple-600 transition"
                            >
                              <FaCopy />
                              <span>Copy</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="text-sm text-gray-500 animate-pulse">
                    Bot is typing...
                  </div>
                )}
                {error && <div className="text-sm text-red-500">{error}</div>}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Fixed at Bottom */}
              <div className="fixed bottom-0 left-0 right-0 lg:ml-64 bg-white/90 backdrop-blur-lg border-t border-white/20 px-6 py-4 z-50">
                <div className="flex items-center gap-2 max-w-7xl mx-auto">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Type your message..."
                    rows={1}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl hover:scale-105 transition"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Suspense>
  );
}