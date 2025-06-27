import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UnreadMessagesContext = createContext();

export function UnreadMessagesProvider({ children, chefId }) {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!chefId) return;

    const fetchUnread = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/messages?chefId=${chefId}`);
        const unread = res.data.filter((msg) => !msg.isRead).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Eroare la fetch mesaje necitite:", err);
      }
    };

    fetchUnread();

    const interval = setInterval(fetchUnread, 3000);
    return () => clearInterval(interval);
  }, [chefId]);

  return (
    <UnreadMessagesContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </UnreadMessagesContext.Provider>
  );
}

export function useUnreadMessages() {
  return useContext(UnreadMessagesContext);
}
