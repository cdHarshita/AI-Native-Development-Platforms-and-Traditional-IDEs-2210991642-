import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/product.js';
import User from './models/User.js';

dotenv.config();

const products = [
  // Laptops
  {
    title: "Apple MacBook Air M2",
    description: "13.6-inch Liquid Retina display, 8GB RAM, 256GB SSD, macOS.",
    price: 114900,
    category: "Laptop",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    stock: 20,
  },
  {
    title: "Dell XPS 15",
    description: "15.6-inch OLED display, Intel i7, 16GB RAM, 512GB SSD.",
    price: 139999,
    category: "Laptop",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400",
    stock: 15,
  },
  {
    title: "HP Pavilion 15",
    description: "15.6-inch FHD, AMD Ryzen 5, 8GB RAM, 512GB SSD, Windows 11.",
    price: 54999,
    category: "Laptop",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    stock: 30,
  },
  {
    title: "Lenovo ThinkPad E14",
    description: "14-inch FHD, Intel i5, 8GB RAM, 256GB SSD, business laptop.",
    price: 62990,
    category: "Laptop",
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400",
    stock: 25,
  },

  // Mobiles
  {
    title: "Samsung Galaxy S24",
    description: "6.2-inch Dynamic AMOLED, 8GB RAM, 128GB, 50MP triple camera.",
    price: 74999,
    category: "Mobiles",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400",
    stock: 40,
  },
  {
    title: "iPhone 15",
    description: "6.1-inch Super Retina XDR, A16 Bionic, 128GB, Dynamic Island.",
    price: 79900,
    category: "Mobiles",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
    stock: 35,
  },
  {
    title: "OnePlus 12R",
    description: "6.78-inch AMOLED 120Hz, Snapdragon 8 Gen 1, 8GB RAM, 128GB.",
    price: 39999,
    category: "Mobiles",
    image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400",
    stock: 50,
  },
  {
    title: "Redmi Note 13 Pro",
    description: "6.67-inch AMOLED, 200MP camera, 12GB RAM, 256GB, 67W charging.",
    price: 26999,
    category: "Mobiles",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    stock: 60,
  },

  // Tablets
  {
    title: "Apple iPad Air (M1)",
    description: "10.9-inch Liquid Retina, M1 chip, 64GB, Wi-Fi, Touch ID.",
    price: 59900,
    category: "Tablets",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
    stock: 20,
  },
  {
    title: "Samsung Galaxy Tab S9",
    description: "11-inch Dynamic AMOLED 2X, Snapdragon 8 Gen 2, 128GB, S-Pen included.",
    price: 72999,
    category: "Tablets",
    image: "https://images.unsplash.com/photo-1589739900266-43b2843f4c12?w=400",
    stock: 18,
  },
  {
    title: "Lenovo Tab P12 Pro",
    description: "12.6-inch AMOLED, Snapdragon 870, 8GB RAM, 256GB, Dolby Atmos.",
    price: 49999,
    category: "Tablets",
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400",
    stock: 15,
  },
  {
    title: "Realme Pad X",
    description: "11-inch 2K display, Snapdragon 695, 6GB RAM, 128GB, 33W fast charge.",
    price: 19999,
    category: "Tablets",
    image: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400",
    stock: 30,
  },
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert products
    const inserted = await Product.insertMany(products);
    console.log(`✅ Inserted ${inserted.length} products`);

    mongoose.connection.close();
    console.log('🔌 Connection closed');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

run();
