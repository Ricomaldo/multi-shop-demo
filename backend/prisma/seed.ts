import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const shopConfigs = {
  brewery: {
    name: "Houblon & Tradition",
    categories: ["Blondes", "Brunes", "IPA", "Saisonnières"],
    products: [
      { name: "Blonde de Garde", price: 4.50, cat: "Blondes" },
      { name: "Blonde d'Été", price: 4.20, cat: "Blondes" },
      { name: "Blonde Houblonnée", price: 4.80, cat: "Blondes" },
      { name: "Triple Blonde", price: 5.20, cat: "Blondes" },
      { name: "Brune Traditionnelle", price: 4.60, cat: "Brunes" },
      { name: "Porter Chocolat", price: 5.00, cat: "Brunes" },
      { name: "Stout Café", price: 5.20, cat: "Brunes" },
      { name: "Brune aux Épices", price: 4.90, cat: "Brunes" },
      { name: "IPA Américaine", price: 5.50, cat: "IPA" },
      { name: "IPA Session", price: 4.80, cat: "IPA" },
      { name: "Double IPA", price: 6.20, cat: "IPA" },
      { name: "IPA Tropicale", price: 5.80, cat: "IPA" },
      { name: "Bière de Noël", price: 5.00, cat: "Saisonnières" },
      { name: "Blanche d'Été", price: 4.40, cat: "Saisonnières" },
      { name: "Pumpkin Ale", price: 4.90, cat: "Saisonnières" },
      { name: "Bière de Mars", price: 4.70, cat: "Saisonnières" }
    ]
  },
  teaShop: {
    name: "Les Jardins de Darjeeling",
    categories: ["Thés Verts", "Thés Noirs", "Thés Blancs", "Infusions"],
    products: [
      { name: "Sencha Premium", price: 12.50, cat: "Thés Verts" },
      { name: "Gyokuro", price: 28.00, cat: "Thés Verts" },
      { name: "Matcha Cérémonial", price: 35.00, cat: "Thés Verts" },
      { name: "Gunpowder", price: 8.90, cat: "Thés Verts" },
      { name: "Earl Grey", price: 9.50, cat: "Thés Noirs" },
      { name: "Darjeeling FTGFOP", price: 15.60, cat: "Thés Noirs" },
      { name: "Assam TGFOP", price: 11.20, cat: "Thés Noirs" },
      { name: "Ceylon Orange Pekoe", price: 10.80, cat: "Thés Noirs" },
      { name: "Bai Mu Dan", price: 18.90, cat: "Thés Blancs" },
      { name: "Silver Needle", price: 45.00, cat: "Thés Blancs" },
      { name: "Moonlight White", price: 22.50, cat: "Thés Blancs" },
      { name: "Shou Mei", price: 16.40, cat: "Thés Blancs" },
      { name: "Camomille Bio", price: 7.20, cat: "Infusions" },
      { name: "Verveine Menthe", price: 6.80, cat: "Infusions" },
      { name: "Rooibos Vanille", price: 8.50, cat: "Infusions" },
      { name: "Tisane Détox", price: 9.90, cat: "Infusions" }
    ]
  }
}

async function main() {
  // Nettoie la DB
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.shop.deleteMany()
  await prisma.merchant.deleteMany()

  // Crée le commerçant
  const merchant = await prisma.merchant.create({
    data: {
      name: "Jean Dupont",
      email: "jean@demoforge.com"
    }
  })

  // Crée les boutiques (brewery et tea-shop pour commencer)
  for (const [shopType, config] of Object.entries(shopConfigs)) {
    const shop = await prisma.shop.create({
      data: {
        name: config.name,
        shopType: shopType,
        merchantId: merchant.id
      }
    })

    // Crée les catégories
    for (const categoryName of config.categories) {
      const category = await prisma.category.create({
        data: {
          name: categoryName,
          shopId: shop.id
        }
      })

      // Crée les produits pour cette catégorie
      const categoryProducts = config.products.filter(p => p.cat === categoryName)
      for (const productData of categoryProducts) {
        await prisma.product.create({
          data: {
            name: productData.name,
            description: `Délicieux ${productData.name.toLowerCase()} de notre collection ${categoryName.toLowerCase()}`,
            price: productData.price,
            image: null,
            attributes: JSON.stringify({ 
              origine: "Artisanal", 
              disponible: true,
              stock: Math.floor(Math.random() * 50) + 10
            }),
            categoryId: category.id,
            shopId: shop.id
          }
        })
      }
    }
  }

  console.log('🌱 Base de données initialisée avec succès!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
