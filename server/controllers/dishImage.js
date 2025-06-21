const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// funzione per caricare l'immagine di un piatto
const uploadDishImage = async (req, res) => {
  try {
    const { url, caption, category, price } = req.body;

    if (!url || !caption || !category || price === undefined) {
      return res.status(400).json({ error: "URL dell'immagine richiesta" });
    }

    // funzione per newImage
    const newImage = await prisma.dishImage.create({
      data: {
        url,
        caption,
        category,
        price: parseFloat(price),
        chefId: req.user.id, // Id preso dal token JWT
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

//funzione per modificare un'immagine di un piatto
const updateDishImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { url, caption, category, price } = req.body;

    if (!url && !caption && !category && price === undefined) {
      return res
        .status(400)
        .json({ error: "Devi fornire almeno un campo da aggiornare" });
    }

    const existingImage = await prisma.dishImage.findUnique({
      where: { id: parseInt(id) },
    });

    // controllo se l'immagine appartiene al cuoco che sta facendo la richiesta
    if (!existingImage) {
      return res
        .status(404)
        .json({ error: "Non puoi modificare questa imagine" });
    }

    // aggiorno l'imagine o il caption
    const updateImage = await prisma.dishImage.update({
      where: { id: parseInt(id) },
      data: {
        url: url || existingImage.url,
        caption: caption || existingImage.caption,
        category: category || existingImage.category,
        price: price !== undefined ? parseFloat(price) : existingImage.price,
      },
    });

    res.status(200).json({
      message: "Immagine del piatto aggiornata con successo",
      image: updateImage,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Errore durante l'aggiornamento dell'immagine" });
  }
};

//funzione per eliminare un'immagine di un piatto
const deleteDishImage = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await prisma.dishImage.findUnique({
      where: { id: parseInt(id) },
    });

    if (!image) {
      return res.statut(404).json({ error: "Immagine non trovata" });
    }

    // controllo se l'immagine appartiene al cuoco che sta facendo la richiesta
    if (image.chefId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Non puoi eliminare questa immagine" });
    }

    await prisma.dishImage.delete({
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

    const dishes = await prisma.dishImage.findMany({
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
