import { useEffect, useState } from "react";
import axios from "axios";
import { useUnreadMessages } from "../components/contexts/UnreadMessagesContext";

export default function ChefMessages({ chefId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openReplies, setOpenReplies] = useState({});
  const [replyStates, setReplyStates] = useState({});
  const [statusMessage, setStatusMessage] = useState(null);

  const { setUnreadCount } = useUnreadMessages();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    if (!chefId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/messages?chefId=${chefId}`);
        const msgs = Array.isArray(res.data) ? res.data : [];
        setMessages(msgs);

        const unread = msgs.filter((msg) => !msg.isRead).length;
        setUnreadCount(unread);
      } catch (error) {
        setStatusMessage({
          type: "error",
          text: "Errore nel recupero dei messaggi.",
        });
        setMessages([]);
        setUnreadCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chefId, setUnreadCount]);

  const showMessage = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const markAsRead = async (messageId) => {
    try {
      await axios.put(`${API_URL}/api/messages/${messageId}/mark-as-read`);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      showMessage("error", "Errore durante la lettura del messaggio.");
    }
  };

  const toggleReplyBox = (msgId) => {
    setOpenReplies((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  const handleReplyChange = (msgId, value) => {
    setReplyStates((prev) => ({
      ...prev,
      [msgId]: value,
    }));
  };

  const handleReplySend = async (msg) => {
    const reply = replyStates[msg.id];
    if (!reply?.trim()) return;

    try {
      await axios.post(`${API_URL}/api/messages/reply`, {
        messageId: msg.id,
        replyText: reply,
      });

      setReplyStates((prev) => ({ ...prev, [msg.id]: "" }));
      setOpenReplies((prev) => ({ ...prev, [msg.id]: false }));
      showMessage("success", "Risposta inviata con successo via email!");
    } catch (err) {
      showMessage("error", "Errore durante l'invio della risposta.");
    }
  };

  if (loading) return <p>Caricamento messaggi...</p>;
  if (!messages.length) return <p>Nessun messaggio ricevuto.</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg relative">
      <h2 className="text-xl font-semibold mb-4">Messaggi ricevuti</h2>

      {statusMessage && (
        <div
          className={`mb-4 px-4 py-2 rounded text-sm ${
            statusMessage.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <ul className="space-y-6">
        {messages.map((msg) => (
          <li
            key={msg.id}
            className="border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  <strong>Da:</strong> {msg.fromName} ({msg.fromEmail})
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(msg.createdAt).toLocaleString()}
                </p>
              </div>
              {!msg.isRead && (
                <span className="text-red-500 text-xs font-bold ml-4">
                  🟢 Nuovo
                </span>
              )}
            </div>

            {!msg.isRead && (
              <button
                onClick={() => markAsRead(msg.id)}
                className="mt-2 text-blue-600 text-sm hover:underline cursor-pointer font-semibold"
              >
                Leggi
              </button>
            )}

            {msg.isRead && (
              <>
                <p className="text-gray-800 mt-2">{msg.content}</p>
                <button
                  onClick={() => toggleReplyBox(msg.id)}
                  className="text-blue-600 font-semibold hover:underline text-sm mt-2 cursor-pointer"
                >
                  {openReplies[msg.id] ? "Annulla" : "Rispondi"}
                </button>
                {openReplies[msg.id] && (
                  <div className="mt-2">
                    <textarea
                      value={replyStates[msg.id] || ""}
                      onChange={(e) =>
                        handleReplyChange(msg.id, e.target.value)
                      }
                      rows={3}
                      className="w-full border rounded-md p-2 text-sm mb-2"
                      placeholder="Scrivi una risposta..."
                    />
                    <button
                      onClick={() => handleReplySend(msg)}
                      className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 text-sm"
                    >
                      Invia
                    </button>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
