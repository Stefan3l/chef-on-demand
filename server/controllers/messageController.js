const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

module.exports = {
  sendMessage,
  getMessagesByChefId,
  markMessageAsRead,
};
