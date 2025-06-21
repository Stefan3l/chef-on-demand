const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // controllo se l'token è presente
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ error: "Token mancante o non valido" });
  }

  // estraggo il token dall'header
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Salvo le informazioni decodificate nel request object
    next(); // Passo al prossimo middleware o alla route
  } catch (error) {
    console.error("Token non valido:", error);
    return res.status(403).json({ error: "Token non valido o scaduto" });
  }
};

module.exports = verifyToken;
// Questo middleware verifica la presenza e la validità del token JWT
