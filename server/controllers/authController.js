const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

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

module.exports = { loginChef };
