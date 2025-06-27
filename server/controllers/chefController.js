const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

// funzione per ottenere tutti i cuochi
const getAllChefs = async (req, res) => {
  // Recupera tutti i cuochi dal database, includendo le immagini dei piatti
  try {
    const chefs = await prisma.chef.findMany({
      include: {
        dish: true,
      },
    });

    // Non restituire la password nel response
    const chefWithoutPassword = chefs.map(({ password, ...chef }) => chef);

    res.json(chefWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Richiesta non riuscita" });
  }
};

// funzione per ottenere il profilo del cuoco autenticato
const getMe = async (req, res) => {
  try {
    const chef = await prisma.chef.findUnique({
      where: { id: req.user.id },
      include: {
        dish: true,
        menus: {
          include: {
            items: true,
          },
        },
        details: true,
      },
    });

    if (!chef) {
      return res.status(404).json({ error: "Chef non trovato" });
    }

    const { password: _, ...chefWithoutPassword } = chef;
    res.json(chefWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante il recupero del profilo" });
  }
};

// funzione per ottenere il profilo del cuoco byID
const getChefById = async (req, res) => {
  try {
    const { id } = req.params;

    const chef = await prisma.chef.findUnique({
      where: { id: Number(id) },
      include: {
        dish: true,
        menus: {
          include: {
            dishes: true,
            chefDetails: true,
          },
        },
      },
    });

    // Controlla se il cuoco esiste
    if (!chef) {
      return res.status(404).json({ error: "Chef non trovato" });
    }

    // Non restituire la password e phone nel response
    const { password, phone, ...chefWithOutPublic } = chef;

    res.json(chefWithOutPublic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante il recupero del profilo" });
  }
};

// funzione per aggiornare il profilo del cuoco autenticato
const updateChef = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    bio,
    previewUrl,
    password,
    city,
    latitude,
    longitude,
    radiusKm,
    language,
    story, // storia personale sulla cucina
    startCooking, // come ha iniziato a cucinare
    secret, // un segreto
  } = req.body;

  // Controllo se l'email modificata è già in uso da un altro chef
  if (email) {
    const existing = await prisma.chef.findUnique({ where: { email } });
    if (existing && existing.id !== req.user.id) {
      return res.status(400).json({ error: "Email già in uso" });
    }
  }

  try {
    // Preparo i dati da aggiornare per il profilo dello chef
    const updateData = {
      first_name,
      last_name,
      bio,
      email,
      phone,
      previewUrl,
      city,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      radiusKm: radiusKm !== undefined ? parseInt(radiusKm) : undefined,
      language: Array.isArray(language) ? language.join(",") : language,
    };

    // Se è stata caricata una nuova immagine del profilo
    if (req.file) {
      updateData.profileImage = req.file.path.replace(/\\/g, "/");
    }

    // Se è stata fornita una nuova password, viene criptata
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Aggiorno le informazioni di base dello chef
    const updatedChef = await prisma.chef.update({
      where: { id: req.user.id },
      data: updateData,
    });

    // Aggiorno o creo i dettagli aggiuntivi dello chef (one-to-one)
    await prisma.chefDetails.upsert({
      where: { chefId: req.user.id },
      update: {
        story,
        startCooking,
        secret,
      },
      create: {
        chefId: req.user.id,
        story,
        startCooking,
        secret,
      },
    });

    // Rimuovo la password dalla risposta per sicurezza
    const { password: _, ...chefWithoutPassword } = updatedChef;

    // Risposta al client con messaggio e dati aggiornati
    res.json({
      message: "Profilo aggiornato con successo",
      chef: chefWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Errore durante l'aggiornamento del profilo",
    });
  }
};

// funzione per eliminare un cuoco
const deleteChef = async (req, res) => {
  try {
    // Trova il cuoco prima di eliminarlo (per recuperare l'immagine)
    const chef = await prisma.chef.findUnique({
      where: { id: req.user.id },
    });

    // Se esiste un'immagine di profilo, la cancelliamo dal disco
    const absoluteImagePath = path.resolve(
      chef.profileImage.replace(/\\/g, "/")
    );

    if (chef?.profileImage && fs.existsSync(absoluteImagePath)) {
      fs.unlinkSync(absoluteImagePath);
    }

    // Elimina il cuoco dal database
    await prisma.chef.delete({
      where: { id: req.user.id },
    });

    res.json({ message: "Chef eliminato con successo" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Errore durante l'eliminazione del profilo" });
  }
};

// funzione per avere il previewUrl del profilo del cuoco
const getChefByPreviewParam = async (req, res) => {
  const previewUrl = req.params.previewUrl;
  const idPart = previewUrl.split("-")[0];
  const slugFromUrl = previewUrl.split("-").slice(1).join("-");
  const id = Number(idPart);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID invalid în previewUrl" });
  }

  try {
    const chef = await prisma.chef.findUnique({
      where: { id },
      include: {
        dish: true,
        menus: true,
        messages: true,
        details: true, // NU chefDetails — vezi mai jos explicația
      },
    });

    if (!chef) {
      return res.status(404).json({ error: "Chef non trovato" });
    }

    if (
      !chef.previewUrl ||
      chef.previewUrl.toLowerCase() !== slugFromUrl.toLowerCase()
    ) {
      return res
        .status(400)
        .json({ error: "Preview URL invalid sau modificat" });
    }

    const { password, phone, ...safeChef } = chef;
    res.json(safeChef);
  } catch (error) {
    console.error("Eroare în getChefByPreviewParam:", error);
    res.status(500).json({ error: "Eroare server" });
  }
};

module.exports = {
  getAllChefs,
  getMe,
  updateChef,
  deleteChef,
  getChefByPreviewParam,
  getChefById,
};
