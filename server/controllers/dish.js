const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

// funzione per caricare un'immagine di un piatto
const uploadDishImage = async (req, res) => {
  try {
    const { name, category } = req.body;

    const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;

    const newImage = await prisma.dish.create({
      data: {
        url: imagePath || "",
        name: name || "",
        category: category || "Altro",
        chefId: req.user.id,
      },
    });

    res.status(201).json({
      message: "Il piatto è stato caricato con successo",
      image: newImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante il caricamento" });
  }
};

// funzione per aggiornare un'immagine di un piatto
const updateDishImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category } = req.body;

    // controllo se possiamo aggiornare qualcosa
    if (!req.file && !name && !category) {
      return res.status(400).json({
        error: "Trebuie să furnizezi cel puțin un câmp de actualizat",
      });
    }

    const existingImage = await prisma.dish.findUnique({
      where: { id: parseInt(id) },
    });

    // se non ce l'imagine, ritorniamo un errore
    if (!existingImage) {
      return res
        .status(404)
        .json({ error: "Nu poți modifica această imagine – nu există" });
    }

    // controlliamo se l'immagine appartiene al cuoco che sta facendo la richiesta
    if (existingImage.chefId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Nu ai permisiunea să modifici această imagine" });
    }

    // se e stato caricato un nuovo file cancelliamo l'immagine vecchia
    if (req.file && fs.existsSync(existingImage.url)) {
      try {
        fs.unlinkSync(path.resolve(existingImage.url));
      } catch (err) {
        console.warn("Eroare la ștergerea imaginii vechi:", err);
      }
    }

    // actualizăm imaginea în baza de date
    const updatedImage = await prisma.dish.update({
      where: { id: parseInt(id) },
      data: {
        url: req.file ? req.file.path.replace(/\\/g, "/") : existingImage.url,
        name: name || existingImage.name,
        category: category || existingImage.category,
      },
    });

    res.status(200).json({
      message: "Imaginea preparatului a fost actualizată cu succes",
      image: updatedImage,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Eroare la actualizarea imaginii preparatului" });
  }
};

// funzione per eliminare un'immagine di un piatto
const deleteDishImage = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await prisma.dish.findUnique({
      where: { id: parseInt(id) },
    });

    if (!image) {
      return res.status(404).json({ error: "Immagine non trovata" });
    }

    // controllo se l'immagine appartiene al cuoco che sta facendo la richiesta
    if (image.chefId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Non puoi eliminare questa immagine" });
    }

    // elimina il file dal disco se esiste
    if (image.url) {
      const absolutePath = path.resolve(image.url.replace(/\\/g, "/"));

      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    }

    await prisma.dish.delete({
      where: { id: parseInt(id) },
    });

    res
      .status(200)
      .json({ message: "Immagine del piatto eliminata con successo" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Errore durante l'eliminazione dell'immagine" });
  }
};

// funzione per recuperare tutte le immagini dei piatti
const getAllDishes = async (req, res) => {
  try {
    const { category, sort, chefId } = req.query;

    const filters = {};

    if (category) {
      filters.category = category;
    }

    if (chefId) {
      filters.chefId = parseInt(chefId);
    }

    // filtriamo le immagini in base ai parametri di ricerca
    const dishes = await prisma.dish.findMany({
      where: filters,
      orderBy: {
        createdAt: sort === "desc" ? "desc" : "asc",
      },
    });

    res.json(dishes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Eroare la recuperarea preparatelor" });
  }
};

module.exports = {
  uploadDishImage,
  updateDishImage,
  deleteDishImage,
  getAllDishes,
};
