const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

// funzione per ottenere tutti i cuochi
const getAllChefs = async (req, res) => {
  // Recupera tutti i cuochi dal database, includendo le immagini dei piatti
  try {
    const chefs = await prisma.chef.findMany({
      include: {
        dishImages: true,
      },
    });
    res.json(chefs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Richiesta non riuscita" });
  }
};

// funzione per creare un nuovo cuoco
const createChef = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      bio,
      profileImage,
      previewUrl,
    } = req.body;

    // Controlla se i campi obbligatori sono presenti
    if (!first_name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Nome, cognome, email e password sono obbligatori" });
    }

    // Controlla se l'email esiste già
    const existingChef = await prisma.chef.findUnique({ where: { email } });
    if (existingChef) {
      return res.status(400).json({ error: "Email esistente" });
    }

    // password hashing
    const hasheadPassword = await bcrypt.hash(password, 10);

    const newChef = await prisma.chef.create({
      data: {
        first_name,
        last_name,
        email,
        password: hasheadPassword,
        phone,
        bio,
        profileImage,
        previewUrl,
      },
    });

    // Non restituire la password nel response
    const { password: _, ...chefWithoutPassword } = newChef;
    res.status(201).json(chefWithoutPassword);
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
        dishImages: true,
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
    profileImage,
    previewUrl,
    password,
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
      profileImage,
      previewUrl,
    };
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

module.exports = { getAllChefs, createChef, getMe, updateChef };
