import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seedFinal = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Clear existing collections
    await db.collection('users').drop().catch(() => {});
    await db.collection('products').drop().catch(() => {});
    console.log('✅ Cleared existing data');

    // Create admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    await db.collection('users').insertOne({
      name: 'Admin User',
      email: 'admin@shoeverse.com',
      password: adminPassword,
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Admin created: admin@shoeverse.com');

    // Create user
    const userPassword = await bcrypt.hash('user123', 10);
    await db.collection('users').insertOne({
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ User created: john@example.com');

    // Create products
    const products = [
      {
        name: "Nike Air Max 270",
        brand: "Nike",
        category: "Running",
        description: "The Nike Air Max 270 delivers performance and style.",
        price: 149.99,
        stock: 45,
        images: [{ url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff", isPrimary: true }],
        sizes: [{ size: 9, quantity: 10 }],
        colors: ["Red", "Black"],
        rating: 4.5,
        numReviews: 128,
        isFeatured: true,
        createdAt: new Date()
      },
      {
        name: "Adidas Ultraboost",
        brand: "Adidas",
        category: "Running",
        description: "Ultimate comfort and energy return.",
        price: 179.99,
        stock: 32,
        images: [{ url: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb", isPrimary: true }],
        sizes: [{ size: 9, quantity: 8 }],
        colors: ["Blue", "Black"],
        rating: 4.7,
        numReviews: 95,
        isFeatured: true,
        createdAt: new Date()
      }
    ];

    await db.collection('products').insertMany(products);
    console.log(`✅ ${products.length} products created`);

    console.log('\n=== 🔑 LOGIN CREDENTIALS ===');
    console.log('Admin: admin@shoeverse.com / admin123');
    console.log('User: john@example.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedFinal();