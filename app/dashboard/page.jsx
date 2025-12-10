// Dashoard Page
"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Bell,
  User,
  Sparkles,
  LogOut,
  Menu,
  X,
  Clock,
  TrendingUp,
  MessageCircle,
  Lightbulb,
  LayoutDashboard,
  MessageCircleMore,
  ChevronRight,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchFriend, setSearchFriend] = useState("");
  const [searchChat, setSearchChat] = useState("");
  const [user, setUser] = useState({ name: "" });
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("friends");
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      if (!session || !session.user) {
        router.push("/login");
        return;
      } else {
        setUser({
          name: session.user.name || "",
          image: session.user.image || "",
        });
      }
    };
    checkAuth();
  }, []);

  const [friends, setFriends] = useState([]);
  const [aiChats, setAiChats] = useState([]);

  const loadAllLists = async () => {
    if (!userEmail) return;

    try {
      // --- Load Friends ---
      const fRes = await fetch(`/api/get-friends?email=${userEmail}`);
      const fData = await fRes.json();

      // --- Load AI Chats ---
      const cRes = await fetch(`/api/fetch-ai-chats`);
      const cData = await cRes.json();

      setFriends(fData.friends || []);
      setAiChats(cData.chats || []);
    } catch (err) {
      console.error("Error loading lists:", err);
    }
  };

  useEffect(() => {
    loadAllLists();
  }, [userEmail]);

  const filteredFriends = friends.filter((f) =>
    (f.name || f.email).toLowerCase().includes(searchFriend.toLowerCase())
  );

  const filteredAIChats = aiChats.filter((c) =>
    (c.name || c.convoId).toLowerCase().includes(searchChat.toLowerCase())
  );

  // handling the logout of a user
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });

      if (res.ok) {
        // Clear LocalStorage
        localStorage.removeItem("auth_token");
        localStorage.clear(); // optional: clears all keys
        sessionStorage.clear();
        window.location.href = "/login";
        router.push("/login");
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-md border-r border-white/20 z-50 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8 py-3 px-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <img
                src="/chatterly_logo.png"
                alt="logo"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              ChatterlyAI
            </span>
          </div>

          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center space-x-3 px-4 py-3 bg-purple-100 text-purple-700 rounded-xl"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/ask-doubt"
              className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
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

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white/70 backdrop-blur-md border-b border-white/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isSidebarOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300 cursor-pointer">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back
              {user?.name && user.name.trim() !== ""
                ? `, ${user.name}! 👋`
                : ","}
            </h2>

            <p className="text-gray-600">Ready to continue?</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Chat with Friends Card */}
            <Link href="/chat" className="block">
              {" "}
              <div
                className="group relative bg-gradient-to-br from-purple-500 via-purple-500 to-purple-600 
rounded-2xl p-8 text-white cursor-pointer overflow-hidden hover:shadow-xl transition-all 
duration-300 hover:scale-105 h-full flex flex-col justify-between"
              >
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">
                        Chat with Friends
                      </h3>
                      <p className="text-purple-100 text-sm">
                        Connect & collaborate
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <MessageCircle size={28} className="text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-purple-100 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    Start Chat <ChevronRight size={18} />
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/ask-doubt" className="block">
              {/* Chat with AI Card */}
              <div
                className="group relative bg-gradient-to-br from-emerald-500 via-emerald-500 to-emerald-600 
rounded-2xl p-8 text-white cursor-pointer overflow-hidden hover:shadow-xl transition-all 
duration-300 hover:scale-105 h-full flex flex-col justify-between"
              >
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">Chat with AI</h3>
                      <p className="text-emerald-100 text-sm">
                        Intelligent assistance
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Sparkles size={28} className="text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-100 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    Start Chat <ChevronRight size={18} />
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <div className="flex gap-1 mb-8 bg-slate-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("friends")}
              className={`px-6 py-2.5 rounded-md font-medium transition-all ${
                activeTab === "friends"
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users size={18} />
                Friends
              </div>
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`px-6 py-2.5 rounded-md font-medium transition-all ${
                activeTab === "ai"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles size={18} />
                AI Chats
              </div>
            </button>
          </div>

          {/* Search and List */}
          {activeTab === "friends" ? (
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search friends..."
                  value={searchFriend}
                  onChange={(e) => setSearchFriend(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white text-slate-900 placeholder-slate-500 transition-all"
                />
              </div>

              {/* Friends List */}
              <div className="space-y-3">
                {filteredFriends.length === 0 && (
                  <p className="text-sm text-gray-400">No friends found</p>
                )}

                {filteredFriends.map((f) => (
                  <div
                    key={f.chatbox_id}
                    onClick={() =>
                      router.push(`/chat?chatboxId=${f.chatbox_id}`)
                    }
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200/50 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {f.name || f.email}
                        </p>
                        <p className="text-sm text-slate-500">Active chat</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">
                        {new Date(f.lastModified).toLocaleDateString()}
                      </p>
                      <ChevronRight
                        size={20}
                        className="text-slate-300 group-hover:text-purple-500 transition-colors mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search AI chats..."
                  value={searchChat}
                  onChange={(e) => setSearchChat(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-slate-900 placeholder-slate-500 transition-all"
                />
              </div>

              {/* AI Chats List */}
              <div className="space-y-3">
                {filteredAIChats.length === 0 && (
                  <p className="text-sm text-gray-400">No chats found</p>
                )}

                {filteredAIChats.map((c) => (
                  <div
                    key={c._id}
                    onClick={() =>
                      router.push(`/ask-doubt?convoId=${c.convoId}`)
                    }
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200/50 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Sparkles size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {c.name || "Untitled Chat"}
                        </p>
                        <p className="text-sm text-slate-500">AI Assistant</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">
                        {new Date(c.lastModified).toLocaleDateString()}
                      </p>
                      <ChevronRight
                        size={20}
                        className="text-slate-300 group-hover:text-emerald-500 transition-colors mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
