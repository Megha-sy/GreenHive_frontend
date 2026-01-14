import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../../socket";
import {
  getMessages,
  sendMessage,
  markAsRead,
} from "../../api/api";

export default function ChatRoom() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  const myId = String(user._id); // 🔥 FORCE STRING

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!id) return;

    loadMessages();
    markAsRead(id);

    socket.emit("joinConversation", id);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    });

    return () => socket.off("receiveMessage");
  }, [id]);

  const loadMessages = async () => {
    const res = await getMessages(id);
    setMessages(res.data);
  };

  const handleSend = async () => {
    if (!text.trim()) return;

    // TEMP MESSAGE (RIGHT SIDE)
    const temp = {
      _id: `temp-${Date.now()}`,
      text,
      sender: { _id: myId },
    };

    setMessages((prev) => [...prev, temp]);
    setText("");

    const res = await sendMessage({
      conversationId: id,
      text,
    });

    // replace temp with real
    setMessages((prev) =>
      prev.map((m) =>
        m._id === temp._id ? res.data : m
      )
    );
  };

  return (
    <div className="h-[calc(100vh-64px)] flex justify-center bg-gray-100">
      <div className="flex flex-col w-full max-w-4xl bg-white shadow">

        <div className="border-b px-4 py-3 font-semibold">
          Chat
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((m) => {
            const senderId = String(
              typeof m.sender === "string"
                ? m.sender
                : m.sender?._id
            );

            const isMe = senderId === myId; // ✅ ALWAYS TRUE FOR SENT

            return (
              <div
                key={m._id}
                className={`px-3 py-2 rounded-lg max-w-[70%] break-words ${
                  isMe
                    ? "bg-green-600 text-white ml-auto"
                    : "bg-gray-200 mr-auto"
                }`}
              >
                {m.text}
              </div>
            );
          })}
        </div>

        <div className="border-t p-3 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type message..."
            className="border p-2 flex-1 rounded"
            onKeyDown={(e) =>
              e.key === "Enter" && handleSend()
            }
          />
          <button
            onClick={handleSend}
            className="bg-green-600 text-white px-4 rounded"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}
