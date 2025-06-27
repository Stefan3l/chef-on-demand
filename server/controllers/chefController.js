const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

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
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalid" });
    }

    const chef = await prisma.chef.findUnique({
      where: { id },
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

    if (!chef) {
      return res.status(404).json({ error: "Chef not found" });
    }

    res.json(chef);
  } catch (error) {
    console.error("Errore in getChef:", error);
    res.status(500).json({ error: "Errore server" });
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
    city, // poate fi gol
    latitude,
    longitude,
    radiusKm,
    language,
    story,
    startCooking,
    secret,
  } = req.body;

  try {
    // Verificăm dacă noul email este deja folosit de alt chef
    if (email) {
      const existing = await prisma.chef.findUnique({ where: { email } });
      if (existing && existing.id !== req.user.id) {
        return res.status(400).json({ error: "Email già in uso" });
      }
    }

    // Obține orașul pe baza coordonatelor (fallback dacă city e gol)
    let resolvedCity = city;
    console.log(
      "VITE_GOOGLE_MAPS_API_KEY ===>",
      process.env.VITE_GOOGLE_MAPS_API_KEY
    );

    if (!city && latitude && longitude) {
      try {
        const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json`,
          {
            params: {
              latlng: `${latitude},${longitude}`,
              key: apiKey,
            },
          }
        );
        console.log(
          "Geocode response:",
          JSON.stringify(response.data, null, 2)
        );

        const results = response.data.results;
        const addressComponents = results?.[0]?.address_components;

        const cityComponent =
          addressComponents?.find((c) => c.types.includes("locality")) ||
          addressComponents?.find((c) =>
            c.types.includes("administrative_area_level_2")
          ) ||
          addressComponents?.find((c) =>
            c.types.includes("administrative_area_level_3")
          );

        if (cityComponent) {
          resolvedCity = cityComponent.long_name;
        }
      } catch (err) {
        console.error("Errore durante la geocodifica inversa:", err.message);
      }
    }

    // Construim obiectul cu datele actualizate
    const updateData = {
      first_name,
      last_name,
      email,
      phone,
      bio,
      previewUrl,
      city: resolvedCity,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      radiusKm: radiusKm !== undefined ? parseInt(radiusKm) : undefined,
      language: Array.isArray(language) ? language.join(",") : language,
    };

    // Dacă a fost trimis un fișier imagine, îl salvăm
    if (req.file) {
      updateData.profileImage = req.file.path.replace(/\\/g, "/");
    }

    // Dacă s-a transmis parolă nouă, o criptăm
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Actualizăm datele din tabelul chef
    const updatedChef = await prisma.chef.update({
      where: { id: req.user.id },
      data: updateData,
    });

    // Upsert pentru detalii adiționale
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

    // Eliminăm parola din răspuns
    const { password: _, ...chefWithoutPassword } = updatedChef;

    res.json({
      message: "Profilo aggiornato con successo",
      chef: chefWithoutPassword,
    });
  } catch (error) {
    console.error("Errore updateChef:", error);
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
        .json({ error: "Preview URL invalid o modificato" });
    }

    const { password, phone, ...safeChef } = chef;
    res.json(safeChef);
  } catch (error) {
    console.error("Errore in  getChefByPreviewParam:", error);
    res.status(500).json({ error: "Errore  server" });
  }
};

// Funzione per ottenere tutti i cuochi che hanno un profilo pubblico (preview)
const getAllChefsWithPreview = async (req, res) => {
  try {
    const chefs = await prisma.chef.findMany({
      where: {
        previewUrl: {
          not: "",
        },
        profileImage: {
          not: "",
        },
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        previewUrl: true,
        profileImage: true,
        bio: true,
      },
    });

    console.log(" Chef trovati:", chefs.length);
    res.status(200).json(chefs);
  } catch (error) {
    console.error(" Errore nel recupero dei profili pubblici:", error);
    res.status(500).json({
      errore: "Errore durante il recupero dei profili pubblici",
    });
  }
};

module.exports = {
  getAllChefsWithPreview,
  getAllChefs,
  getMe,
  updateChef,
  deleteChef,
  getChefByPreviewParam,
  getChefById,
};
