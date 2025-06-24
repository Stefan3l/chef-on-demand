const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

// funzione per caricare l'immagine di un piatto
const uploadDishImage = async (req, res) => {
  try {
    const { caption, category, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Immagine obbligatoria" });
    }

    const imagePath = req.file.path;

    // funzione per newImage
    const newImage = await prisma.dish.create({
      data: {
        url: imagePath,
        caption: caption || "",
        category: category || "Altro",
        price: parseFloat(price) || 0,
        chefId: req.user.id,
      },
    });

    res.status(201).json({
      message: "Immagine del piatto caricata con successo",
      image: newImage,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Errore durante il caricamento dell'immagine" });
  }
};

// funzione per modificare un'immagine di un piatto
const updateDishImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { caption, category, price } = req.body;

    if (!req.file && !caption && !category && price === undefined) {
      return res
        .status(400)
        .json({ error: "Devi fornire almeno un campo da aggiornare" });
    }

    const existingImage = await prisma.dish.findUnique({
      where: { id: parseInt(id) },
    });

    // controllo se l'immagine esiste
    if (!existingImage) {
      return res
        .status(404)
        .json({ error: "Non puoi modificare questa immagine" });
    }

    // controllo se l'immagine appartiene al cuoco autenticato
    if (existingImage.chefId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Non hai il permesso di modificare questa immagine" });
    }

    // se c'è un nuovo file, cancella il vecchio
    if (req.file && fs.existsSync(existingImage.url)) {
      fs.unlinkSync(path.resolve(existingImage.url));
    }

    const updatedImage = await prisma.dish.update({
      where: { id: parseInt(id) },
      data: {
        url: req.file ? req.file.path : existingImage.url,
        caption: caption || existingImage.caption,
        category: category || existingImage.category,
        price: price !== undefined ? parseFloat(price) : existingImage.price,
      },
    });

    res.status(200).json({
      message: "Immagine del piatto aggiornata con successo",
      image: updatedImage,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Errore durante l'aggiornamento dell'immagine" });
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
    if (image.url && fs.existsSync(image.url)) {
      fs.unlinkSync(path.resolve(image.url));
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

//funzione per avere tutti piatti e filtrarli per categoria, prezzo, chefId
const getAllDishes = async (req, res) => {
  try {
    const { category, priceMin, priceMax, sort, chefId } = req.query;

    const filters = {};

    if (category) {
      filters.category = category;
    }

    if (chefId) {
      filters.chefId = parseInt(chefId);
    }

    if (priceMin || priceMax) {
      filters.price = {};
      if (priceMin) {
        filters.price.gte = parseFloat(priceMin);
      }
      if (priceMax) {
        filters.price.lte = parseFloat(priceMax);
      }
    }

    const dishes = await prisma.dish.findMany({
      where: filters,
      orderBy: {
        price: sort === "desc" ? "desc" : "asc",
      },
    });
    res.json(dishes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante il recupero dei piatti" });
  }
};

module.exports = {
  uploadDishImage,
  updateDishImage,
  deleteDishImage,
  getAllDishes,
};
