import mongoose from 'mongoose';
import dotenv from 'dotenv';
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
        description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality. Perfect for music lovers and professionals.',
        price: 149.99,
        stock: 50,
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
        ]
    },
    {
        name: 'Smart Watch Pro',
        description: 'Advanced fitness tracker with heart rate monitor, GPS, sleep tracking, and 7-day battery life. Water-resistant up to 50m.',
        price: 299.99,
        stock: 35,
        images: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
            'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500'
        ]
    },
    {
        name: 'USB-C Hub 7-in-1',
        description: '7-in-1 USB-C hub with HDMI, USB 3.0 ports, SD/microSD card readers, and 100W power delivery. Compatible with MacBook and other USB-C devices.',
        price: 49.99,
        stock: 100,
        images: [
            'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500'
        ]
    },
    {
        name: '4K Webcam Pro',
        description: 'Professional 4K webcam with autofocus, built-in dual microphones, and wide-angle lens. Perfect for streaming and video conferencing.',
        price: 129.99,
        stock: 45,
        images: [
            'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=500'
        ]
    },

    // Clothing
    {
        name: 'Classic Denim Jacket',
        description: 'Timeless denim jacket made from premium cotton. Available in multiple sizes. Perfect for casual wear and layering.',
        price: 79.99,
        stock: 60,
        images: [
            'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
            'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500'
        ]
    },
    {
        name: 'Cotton T-Shirt 3-Pack',
        description: 'Premium 100% cotton t-shirts in classic colors. Soft, breathable, and durable. Machine washable.',
        price: 39.99,
        stock: 120,
        images: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'
        ]
    },
    {
        name: 'Running Sneakers',
        description: 'Lightweight running shoes with cushioned sole and breathable mesh upper. Designed for comfort and performance.',
        price: 89.99,
        stock: 75,
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500'
        ]
    },

    // Books
    {
        name: 'The Art of Programming',
        description: 'Comprehensive guide to modern programming practices. Perfect for beginners and experienced developers. 500+ pages.',
        price: 49.99,
        stock: 40,
        images: [
            'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500'
        ]
    },
    {
        name: 'Mindfulness Journal',
        description: 'Daily mindfulness and gratitude journal with prompts and exercises. 365 days of guided reflection.',
        price: 24.99,
        stock: 80,
        images: [
            'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'
        ]
    },
    {
        name: 'Cooking Masterclass Book',
        description: 'Professional cooking techniques and 100+ recipes from world-renowned chefs. Full-color photography.',
        price: 39.99,
        stock: 55,
        images: [
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500'
        ]
    },

    // Home & Garden
    {
        name: 'Aromatherapy Diffuser',
        description: 'Ultrasonic essential oil diffuser with LED lights and auto shut-off. Creates a relaxing atmosphere with therapeutic benefits.',
        price: 34.99,
        stock: 90,
        images: [
            'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500'
        ]
    },
    {
        name: 'Indoor Plant Set (5 Plants)',
        description: 'Collection of 5 easy-care indoor plants including snake plant, pothos, and succulents. Perfect for beginners.',
        price: 59.99,
        stock: 30,
        images: [
            'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=500',
            'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=500'
        ]
    },
    {
        name: 'LED Desk Lamp',
        description: 'Adjustable LED desk lamp with 3 color modes and 5 brightness levels. USB charging port included. Eye-friendly lighting.',
        price: 44.99,
        stock: 65,
        images: [
            'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=500'
        ]
    },

    // Sports
    {
        name: 'Yoga Mat Premium',
        description: 'Extra-thick yoga mat with non-slip surface and carrying strap. Made from eco-friendly TPE material. 72" x 24".',
        price: 29.99,
        stock: 85,
        images: [
            'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'
        ]
    },
    {
        name: 'Resistance Bands Set',
        description: 'Set of 5 resistance bands with different resistance levels. Includes door anchor, handles, and carrying bag.',
        price: 24.99,
        stock: 110,
        images: [
            'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500'
        ]
    },
    {
        name: 'Water Bottle Insulated 32oz',
        description: 'Stainless steel insulated water bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free with leak-proof lid.',
        price: 34.99,
        stock: 95,
        images: [
            'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500'
        ]
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Category.deleteMany({});
        await Product.deleteMany({});
        console.log('🗑️  Cleared existing categories and products');

        // Get or create admin user for products
        let adminUser = await User.findOne({ email: 'admin@engagecart.com' });
        if (!adminUser) {
            adminUser = await User.create({
                name: 'Admin',
                email: 'admin@engagecart.com',
                password: 'admin123', // Will be hashed by pre-save hook
                role: 'admin'
            });
            console.log('👤 Created admin user');
        }

        // Create categories
        const createdCategories = await Category.insertMany(categories);
        console.log(`📁 Created ${createdCategories.length} categories`);

        // Create products with category references
        const categoryMap = {
            'Electronics': createdCategories[0]._id,
            'Clothing': createdCategories[1]._id,
            'Books': createdCategories[2]._id,
            'Home & Garden': createdCategories[3]._id,
            'Sports': createdCategories[4]._id
        };

        const productsWithCategories = [
            // Electronics (4 products)
            { ...products[0], category: categoryMap['Electronics'], createdBy: adminUser._id },
            { ...products[1], category: categoryMap['Electronics'], createdBy: adminUser._id },
            { ...products[2], category: categoryMap['Electronics'], createdBy: adminUser._id },
            { ...products[3], category: categoryMap['Electronics'], createdBy: adminUser._id },

            // Clothing (3 products)
            { ...products[4], category: categoryMap['Clothing'], createdBy: adminUser._id },
            { ...products[5], category: categoryMap['Clothing'], createdBy: adminUser._id },
            { ...products[6], category: categoryMap['Clothing'], createdBy: adminUser._id },

            // Books (3 products)
            { ...products[7], category: categoryMap['Books'], createdBy: adminUser._id },
            { ...products[8], category: categoryMap['Books'], createdBy: adminUser._id },
            { ...products[9], category: categoryMap['Books'], createdBy: adminUser._id },

            // Home & Garden (3 products)
            { ...products[10], category: categoryMap['Home & Garden'], createdBy: adminUser._id },
            { ...products[11], category: categoryMap['Home & Garden'], createdBy: adminUser._id },
            { ...products[12], category: categoryMap['Home & Garden'], createdBy: adminUser._id },

            // Sports (3 products)
            { ...products[13], category: categoryMap['Sports'], createdBy: adminUser._id },
            { ...products[14], category: categoryMap['Sports'], createdBy: adminUser._id },
            { ...products[15], category: categoryMap['Sports'], createdBy: adminUser._id }
        ];

        const createdProducts = await Product.insertMany(productsWithCategories);
        console.log(`📦 Created ${createdProducts.length} products`);

        console.log('\n✨ Database seeded successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Categories: ${createdCategories.length}`);
        console.log(`   Products: ${createdProducts.length}`);
        console.log(`   Admin User: admin@engagecart.com / admin123`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
