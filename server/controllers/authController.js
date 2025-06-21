const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();
const crypto = require("crypto");

// loghinChef funzione per autenticare un cuoco
const loginChef = async (req, res) => {
  const { email, password } = req.body;

  // Controlla se i campi obbligatori sono presenti
  if (!email || !password) {
    return res.status(400).json({ error: "Email e password sono obbligatori" });
  }

  try {
    const chef = await prisma.chef.findUnique({ where: { email } });

    if (!chef) {
      return res.status(404).json({ error: "Cuoco non trovato" });
    }

    const passwordMatch = await bcrypt.compare(password, chef.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Password sbagliata" });
    }

    // Genera un token JWT
    const token = jwt.sign(
      { id: chef.id, email: chef.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // tolgli la password dal risultato
    const { password: _, ...chefData } = chef;

    res.json({
      message: "Login effettuato con successo",
      token,
      chef: chefData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante il login" });
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
      city,
      latitude,
      longitude,
      radius_km,
      language,
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
    const hashedPassword = await bcrypt.hash(password, 10);

    const newChef = await prisma.chef.create({
      data: {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        phone,
        bio,
        profileImage,
        previewUrl,
        city,
        latitude,
        longitude,
        radius_km,
        language,
      },
    });

    // Non restituire la password nel response
    const { password: _, ...chefWithoutPassword } = newChef;

    // generazione del token JWT
    const token = jwt.sign(
      {
        id: newChef.id,
        email: newChef.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(201).json({
      message: "Cuoco creato con successo",
      token,
      chef: chefWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Richiesta non riuscita" });
  }
};

// funzione per gestire la richiesta di reset della password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Controlla se l'email è presente
  if (!email) return res.status(400).json({ error: "Email è obbligatoria" });

  // Controlla se il cuoco esiste
  const chef = await prisma.chef.findUnique({ where: { email } });
  if (!chef) return res.status(404).json({ error: "Email non trovato" });

  const token = crypto.randomBytes(32).toString("hex"); // Genera un token casuale di 32 byte
  const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minuti

  // Salva il token nel database con la data di scadenza
  await prisma.passwordResetToken.create({
    data: {
      token,
      email,
      expiresAt: expires,
    },
  });

  res.json({
    message: "Token di reset della password generato con successo",
    resetLink: `http://localhost:3000/reset-password?token=${token}`,
  });
};

// funzione resetPassword
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  // Controlla se il token e la nuova password sono presenti
  if (!token || !newPassword)
    return res
      .status(400)
      .json({ error: "Token e nuova password sono obbligatori" });

  // Controlla se il token è valido e non scaduto
  const resetEntry = await prisma.passwordResetToken.findUnique({
    where: { token },
  });
  if (!resetEntry) return res.status(404).json({ error: "Token non valido" });

  // Hash della nuova password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // update della password del cuoco
  await prisma.chef.update({
    where: { email: resetEntry.email },
    data: { password: hashedPassword },
  });

  // Elimina il token di reset dopo l'uso
  await prisma.passwordResetToken.delete({ where: { token } });

  res.json({ message: "Password aggiornata con successo" });
};

module.exports = { loginChef, forgotPassword, resetPassword, createChef };
