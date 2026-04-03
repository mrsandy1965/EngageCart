import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Category from './src/models/category.model.js';
import Product from './src/models/product.model.js';
import User from './src/models/user.model.js';

dotenv.config();

const categories = [
    {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and accessories',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500'
    },
    {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and apparel',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500'
    },
    {
        name: 'Books',
        slug: 'books',
        description: 'Books and literature',
        image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500'
    },
    {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Home decor and gardening supplies',
        image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=500'
    },
    {
        name: 'Sports',
        slug: 'sports',
        description: 'Sports equipment and fitness gear',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500'
    }
];

const products = [
    // Electronics
    {
        name: 'Wireless Bluetooth Headphones',
        description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.',
        price: 149.99, stock: 50,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500']
    },
    {
        name: 'Smart Watch Pro',
        description: 'Advanced fitness tracker with heart rate monitor, GPS, sleep tracking, and 7-day battery life. Water-resistant up to 50m.',
        price: 299.99, stock: 35,
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500']
    },
    {
        name: 'USB-C Hub 7-in-1',
        description: '7-in-1 hub with HDMI, USB 3.0, SD card readers, and 100W power delivery.',
        price: 49.99, stock: 100,
        images: ['https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500']
    },
    {
        name: '4K Webcam Pro',
        description: 'Professional 4K webcam with autofocus, built-in dual microphones, and wide-angle lens.',
        price: 129.99, stock: 45,
        images: ['https://images.unsplash.com/photo-1588508065123-287b28e013da?w=500']
    },

    // Clothing
    {
        name: 'Classic Denim Jacket',
        description: 'Timeless denim jacket made from premium cotton. Available in multiple sizes.',
        price: 79.99, stock: 60,
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500']
    },
    {
        name: 'Cotton T-Shirt 3-Pack',
        description: 'Premium 100% cotton t-shirts in classic colors. Soft, breathable, and durable.',
        price: 39.99, stock: 120,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500']
    },
    {
        name: 'Running Sneakers',
        description: 'Lightweight running shoes with cushioned sole and breathable mesh upper.',
        price: 89.99, stock: 75,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500']
    },

    // Books
    {
        name: 'The Art of Programming',
        description: 'Comprehensive guide to modern programming practices. 500+ pages.',
        price: 49.99, stock: 40,
        images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500']
    },
    {
        name: 'Mindfulness Journal',
        description: 'Daily mindfulness and gratitude journal with prompts and exercises. 365 days.',
        price: 24.99, stock: 80,
        images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500']
    },
    {
        name: 'Cooking Masterclass Book',
        description: 'Professional cooking techniques and 100+ recipes from world-renowned chefs.',
        price: 39.99, stock: 55,
        images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500']
    },

    // Home & Garden
    {
        name: 'Aromatherapy Diffuser',
        description: 'Ultrasonic essential oil diffuser with LED lights and auto shut-off.',
        price: 34.99, stock: 90,
        images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500']
    },
    {
        name: 'Indoor Plant Set (5 Plants)',
        description: 'Collection of 5 easy-care indoor plants including snake plant, pothos, and succulents.',
        price: 59.99, stock: 30,
        images: ['https://images.unsplash.com/photo-1463320726281-696a485928c7?w=500']
    },
    {
        name: 'LED Desk Lamp',
        description: 'Adjustable LED desk lamp with 3 color modes and 5 brightness levels.',
        price: 44.99, stock: 65,
        images: ['https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=500']
    },

    // Sports
    {
        name: 'Yoga Mat Premium',
        description: 'Extra-thick yoga mat with non-slip surface and carrying strap. Eco-friendly TPE.',
        price: 29.99, stock: 85,
        images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500']
    },
    {
        name: 'Resistance Bands Set',
        description: 'Set of 5 resistance bands with different resistance levels. Includes door anchor and handles.',
        price: 24.99, stock: 110,
        images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500']
    },
    {
        name: 'Water Bottle Insulated 32oz',
        description: 'Stainless steel insulated bottle. Cold 24hr / hot 12hr. BPA-free with leak-proof lid.',
        price: 34.99, stock: 95,
        images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500']
    }
];

// Maps each product (by index) to its category name
const PRODUCT_CATEGORIES = [
    'Electronics', 'Electronics', 'Electronics', 'Electronics',
    'Clothing',    'Clothing',    'Clothing',
    'Books',       'Books',       'Books',
    'Home & Garden', 'Home & Garden', 'Home & Garden',
    'Sports',      'Sports',      'Sports',
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // ── Admin user (idempotent: upsert by email) ────────────────────────────
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const adminUser = await User.findOneAndUpdate(
            { email: 'admin@engagecart.com' },
            {
                $setOnInsert: {
                    name:     'Admin',
                    email:    'admin@engagecart.com',
                    password: hashedPassword,
                    role:     'admin',
                }
            },
            { upsert: true, new: true }
        );
        console.log('👤 Admin user ensured (upserted)');

        // ── Categories (idempotent: upsert by slug) ─────────────────────────────
        const categoryOps = categories.map((cat) => ({
            updateOne: {
                filter: { slug: cat.slug },
                update: { $set: cat },
                upsert: true,
            },
        }));
        await Category.bulkWrite(categoryOps);
        console.log(`📁 ${categories.length} categories upserted`);

        // Re-fetch to get _ids for product foreign keys
        const createdCategories = await Category.find({
            slug: { $in: categories.map((c) => c.slug) },
        });
        const categoryMap = Object.fromEntries(
            createdCategories.map((c) => [c.name, c._id])
        );

        // ── Products (idempotent: upsert by name) ───────────────────────────────
        const productOps = products.map((product, i) => ({
            updateOne: {
                filter: { name: product.name },
                update: {
                    $set: {
                        ...product,
                        category:  categoryMap[PRODUCT_CATEGORIES[i]],
                        createdBy: adminUser._id,
                        isActive:  true,
                    },
                },
                upsert: true,
            },
        }));
        await Product.bulkWrite(productOps);
        console.log(`📦 ${products.length} products upserted`);

        console.log('\n✨ Database seeded successfully! (idempotent — safe to re-run)');
        console.log('\n📊 Summary:');
        console.log(`   Categories : ${categories.length}`);
        console.log(`   Products   : ${products.length}`);
        console.log(`   Admin User : admin@engagecart.com / admin123`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
