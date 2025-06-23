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
      },
    });

    // Controlla se il cuoco esiste
    if (!chef) {
      return res.status(404).json({ error: "Chef non trovato" });
    }
    // Non restituire la password nel response
    const { password: _, ...chefWithoutPassword } = chef;

    res.json(chefWithoutPassword);
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
    radius_km,
    language,
  } = req.body;

  // controllo se la email modificata esiste già
  if (email) {
    const existing = await prisma.chef.findUnique({
      where: { email },
    });
    if (existing && existing.id !== req.user.id) {
      return res.status(400).json({ error: "Email già in uso" });
    }
  }

  try {
    // definisce i dati da aggiornare
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
      radius_km: radius_km ? parseInt(radius_km) : undefined,
      language,
    };

    // Se è stata caricata una nuova immagine del profilo
    if (req.file) {
      updateData.profileImage = req.file.path;
    }

    // Se la password è stata fornita, esegui l'hashing
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Aggiorna il cuoco nel database
    const updateChef = await prisma.chef.update({
      where: { id: req.user.id },
      data: updateData,
    });

    // Non restituire la password nel response
    const { password: _, ...chefWithoutPassword } = updateChef;

    res.json({
      message: "Profilo aggiornato con successo",
      chef: chefWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Errore durante l'aggiornamento del profilo" });
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
    if (chef?.profileImage && fs.existsSync(chef.profileImage)) {
      fs.unlinkSync(path.resolve(chef.profileImage));
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
const getChefByPreviewUrl = async (req, res) => {
  const { previewUrl } = req.params;

  try {
    const chef = await prisma.chef.findUnique({
      where: { previewUrl },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        bio: true,
        email: true,
        profileImage: true,
        previewUrl: true,
        city: true,
        latitude: true,
        longitude: true,
        radius_km: true,
        language: true,
        dish: {
          select: {
            id: true,
            url: true,
            caption: true,
            category: true,
            price: true,
            createdAt: true,
          },
        },
      },
    });
    if (!chef) {
      return res.status(404).json({ error: "Chef non trovato" });
    }

    res.json(chef);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante il recupero del cuoco" });
  }
};

module.exports = {
  getAllChefs,
  getMe,
  updateChef,
  deleteChef,
  getChefByPreviewUrl,
};
