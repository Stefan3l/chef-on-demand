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
      categories,
    } = req.body;

    if (
      !name ||
      !pricePerPerson ||
      !minGuests ||
      !maxGuests ||
      !Array.isArray(categories) ||
      categories.length === 0
    ) {
      return res.status(400).json({ error: "Campi obbligatori mancanti" });
    }

    const chefId = req.user.id; // presupunem că autentificarea e făcută

    const menu = await prisma.menu.create({
      data: {
        name,
        description,
        pricePerPerson: parseFloat(pricePerPerson),
        minGuests: parseInt(minGuests),
        maxGuests: parseInt(maxGuests),
        chefId,
        categories: {
          create: categories.map((cat) => ({
            name: cat.name,
            type: cat.type,
            dishes: {
              create: cat.dishes.map((dish) => ({
                dish: {
                  create: {
                    name: dish.name,
                    category: cat.name,
                    chefId,
                  },
                },
              })),
            },
          })),
        },
      },
      include: {
        categories: {
          include: {
            dishes: {
              include: {
                dish: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json(menu);
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
        categories: {
          include: {
            dishes: {
              include: {
                dish: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
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
        categories: {
          include: {
            dishes: {
              include: {
                dish: true,
              },
            },
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
// funzione per eliminare un menu
const deleteMenu = async (req, res) => {
  try {
    const menuId = parseInt(req.params.id);

    // 1. șterge întâi legăturile dintre MenuCategory și Dish
    await prisma.menuCategoryDish.deleteMany({
      where: {
        menuCategory: {
          menuId: menuId,
        },
      },
    });

    // 2. apoi șterge categoriile
    await prisma.menuCategory.deleteMany({
      where: {
        menuId: menuId,
      },
    });

    // 3. apoi șterge meniul propriu-zis
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
  updateMenu,
  deleteMenu,
};
