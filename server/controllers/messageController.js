const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const sendEmail = require("../utils/sendEmail");

// funzione per inviare un messaggio
const sendMessage = async (req, res) => {
  try {
    const { fromName, fromEmail, content, fromChef, chefId } = req.body;

    if (!fromName || !fromEmail || !content || chefId === undefined) {
      return res.status(400).json({ error: "Câmpuri obligatorii lipsă" });
    }

    // creazione del messaggio
    const message = await prisma.message.create({
      data: {
        fromName,
        fromEmail,
        content,
        fromChef: !!fromChef, // true se e dal cuoco, false se e da un cliente
        chefId: parseInt(chefId),
      },
    });

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante l'invio del messaggio" });
  }
};

// funzione per ottenere tutti i messaggi di un cuoco
const getMessagesByChefId = async (req, res) => {
  const { chefId } = req.query;

  if (!chefId) {
    return res.status(400).json({ error: "ID del cuoco mancante" });
  }

  try {
    const messages = await prisma.message.findMany({
      where: {
        chefId: parseInt(chefId),
      },
      orderBy: {
        createdAt: "desc", // i mesaggi piu recenti
      },
    });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante il recupero dei messaggi" });
  }
};

// funzione per marcare un messaggio come letto
const markMessageAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await prisma.message.update({
      where: { id: parseInt(id) },
      data: { isRead: true },
    });

    res.json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Eroare la actualizarea mesajului" });
  }
};

// funzione per inviare un'email di notifica
const replyToMessage = async (req, res) => {
  const { messageId, replyText } = req.body;

  try {
    const originalMsg = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!originalMsg) {
      return res.status(404).json({ error: "Mesajul nu a fost găsit." });
    }

    // Trimite email către client
    await sendEmail({
      to: originalMsg.fromEmail,
      subject: `Risposta dello Chef`,
      text: `Lo chef ti ha risposto:\n\n${replyText}`,
      html: `
        <p>Lo chef ti ha risposto:</p>
        <blockquote>${replyText}</blockquote>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Eroare la trimiterea răspunsului:", err);
    return res.status(500).json({ error: "Eroare server." });
  }
};

module.exports = {
  sendMessage,
  getMessagesByChefId,
  markMessageAsRead,
  replyToMessage,
};
