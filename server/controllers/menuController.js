const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Crea un nuovo menu completo
const createMenu = async (req, res) => {
  try {
    const {
      name,
      description,
      pricePerPerson,
      minGuests,
      maxGuests,
      categories, // array con: { name: "Antipasto", type: "All Inclusive", dishes: ["Bruschette", "Caprese"] }
    } = req.body;

    if (
      !name ||
      !pricePerPerson ||
      !minGuests ||
      !maxGuests ||
      !Array.isArray(categories)
    ) {
      return res.status(400).json({ error: "Campi obbligatori mancanti" });
    }

    const chefId = req.user.id;

    // 1. Creiamo il Menu
    const menu = await prisma.menu.create({
      data: {
        name,
        description,
        pricePerPerson: parseFloat(pricePerPerson),
        minGuests: parseInt(minGuests),
        maxGuests: parseInt(maxGuests),
        chefId,
      },
    });

    // Aggiungiamo le categorie al meniu
    const menuItems = categories.flatMap((cat) =>
      cat.dishes
        .filter((dishName) => dishName.trim() !== "")
        .map((dishName) => ({
          name: dishName,
          category: cat.name,
          type: cat.type,
          menuId: menu.id,
        }))
    );

    if (menuItems.length > 0) {
      await prisma.menuItem.createMany({
        data: menuItems,
      });
    }

    const fullMenu = await prisma.menu.findUnique({
      where: { id: menu.id },
      include: { items: true },
    });

    res.status(201).json(fullMenu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante la creazione del menu" });
  }
};

// funzione per ottenere tutti i menu
const getAllMenus = async (req, res) => {
  try {
    const { chefId } = req.query;
    const whereClause = chefId ? { chefId: parseInt(chefId) } : {};

    const menus = await prisma.menu.findMany({
      where: whereClause,
      include: {
        items: {
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(menus);
  } catch (error) {
    console.error("Errore getAllMenus:", error);
    res.status(500).json({ error: "Errore durante il caricamento dei menu" });
  }
};

// funzione per ottenere tutti i menu di un chef specifico
const getMenus = async (req, res) => {
  try {
    const chefId = req.user.id; // IA din token, nu din URL

    const menus = await prisma.menu.findMany({
      where: { chefId },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(menus);
  } catch (error) {
    console.error("EROARE getAllMenus:", error);
    res.status(500).json({ error: "Eroare la încărcarea meniurilor" });
  }
};

// funzione per ottenere un menu specifico
const getMenuById = async (req, res) => {
  try {
    const menuId = parseInt(req.params.id);
    const chefId = req.user.id;

    const menu = await prisma.menu.findUnique({
      where: { id: menuId },
      include: {
        items: true,
      },
    });

    if (!menu) {
      // Nu afișa acces negat, doar spune că nu există
      return res.status(200).json(null); // sau [] dacă preferi
    }

    if (menu.chefId !== chefId) {
      return res.status(403).json({ error: "Accesso negato a questo menu" });
    }

    res.json(menu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante il recupero del menu" });
  }
};
// fimzione per riordinare gli elementi del menu
const reorderMenuItems = async (req, res) => {
  const menuId = parseInt(req.params.id);
  const chefId = req.user.id;
  const { items } = req.body;

  try {
    // Verifica se il menu esiste e appartiene allo chef autenticato
    const menu = await prisma.menu.findUnique({
      where: { id: menuId },
    });

    if (!menu) {
      return res.status(404).json({ error: "Menu non trovato." });
    }

    if (menu.chefId !== chefId) {
      return res.status(403).json({ error: "Accesso negato a questo menu." });
    }

    // Aggiorna l'ordine per ogni piatto del menu
    const aggiornamenti = items.map((item, index) =>
      prisma.menuItem.update({
        where: { id: item.id },
        data: { order: index },
      })
    );

    await Promise.all(aggiornamenti);

    res.json({ message: "Ordine dei piatti salvato con successo." });
  } catch (error) {
    console.error("Errore durante il riordino dei piatti:", error);
    res
      .status(500)
      .json({ error: "Errore durante il salvataggio dell'ordine." });
  }
};

// funzione per eliminare un menu
const deleteMenu = async (req, res) => {
  try {
    const menuId = parseInt(req.params.id);

    await prisma.menuItem.deleteMany({
      where: { menuId },
    });

    // Apoi ștergem meniul
    await prisma.menu.delete({
      where: { id: menuId },
    });

    res.json({ message: "Menu cancellato con successo" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante la cancellazione del menu" });
  }
};

module.exports = {
  createMenu,
  getAllMenus,
  getMenuById,
  getMenus,
  deleteMenu,
  reorderMenuItems,
};
