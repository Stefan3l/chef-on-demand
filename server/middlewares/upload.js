const multer = require("multer");
const path = require("path");

// Configurazione di Multer per l'upload dei file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Cartella di destinazione per i file caricati
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Nome del file con estensione originale
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
// Questo middleware può essere utilizzato per gestire l'upload dei file nelle rotte
