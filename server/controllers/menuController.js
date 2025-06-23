const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// funzione per creare un nuovo menu
const createMenu = async (req, res) => {
  try {
    const {
      name,
      description,
      pricePerPerson,
      minGuests,
      maxGuests,
      chefId,
      dishes,
    } = req.body;
    // Controlla se i campi obbligatori sono presenti
    if (
      !name ||
      !pricePerPerson ||
      !minGuests ||
      !maxGuests ||
      !chefId ||
      !Array.isArray(dishes)
    ) {
      return res.status(400).json({ error: "Campi obbligatori mancanti" });
    }
    // creo un nuovo menu
    const menu = await prisma.menu.create({
      data: {
        name,
        description,
        pricePerPerson,
        minGuests,
        maxGuests,
        chefId,
        dishes: {
          create: dishes.map((d) => ({
            dish: { connect: { id: d.dishId } },
            order: d.order,
          })),
        },
      },
      include: {
        dishes: {
          include: {
            dish: true, // Include le informazioni del piatto associato
          },
        },
      },
    });

    res.status(201).json(menu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante la creazione" });
  }
};

// funzione per ottenere tutti i menu
const getAllMenus = async (req, res) => {
  try {
    const { chefId } = req.query;

    const whereClause = chefId ? { chefOd: parseInt(chefId) } : {};

    const menus = await prisma.menu.findMany({
      where: whereClause,
      include: {
        dishes: {
          include: {
            dish: true, // Include le informazioni del piatto associato
          },
        },
      },
      orderBy: { createdAt: "desc" }, // Ordina per data di creazione, dal più recente al più vecchio
    });

    res.json(menus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante il recupero dei menu" });
  }
};

// funzione per ottenere un menu specifico
const getMenuById = async (req, res) => {
  try {
    const menuId = parseInt(req.params.id);

    const menu = await prisma.menu.findUnique({
      where: { id: menuId },
      include: {
        dishes: {
          include: {
            dish: true, // Include le informazioni del piatto associato
          },
        },
      },
    });

    if (!menu) {
      return res.status(404).json({ error: "Menu non trovato" });
    }
    res.json(menu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante il recupero del menu" });
  }
};

// funzione per aggiornare un menu
const updateMenu = async (req, res) => {
  try {
    const menuId = parseInt(req.params.id);
    const { name, description, pricePerPerson, minGuests, maxGuests } =
      req.body;

    const updatedMenu = await prisma.menu.update({
      where: { id: menuId },
      data: {
        name,
        description,
        pricePerPerson,
        minGuests,
        maxGuests,
      },
    });

    res.json(updatedMenu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante l'aggiornamento del menu" });
  }
};

// funzione per eliminare un menu
const deleteMenu = async (req, res) => {
  try {
    const menuId = parseInt(req.params.id);

    // cancella prima tutte le associazioni tra il menu e i piatti
    await prisma.menuDish.deleteMany({
      where: { menuId },
    });

    // poi cancella il menu stesso
    await prisma.menu.delete({
      where: { id: menuId },
    });

    res.json({ message: "Menu cancellato con succeso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante la cancellazione del menu" });
  }
};

module.exports = {
  createMenu,
  getAllMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
};
