import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: [200, 'Product name cannot exceed 200 characters']
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
            maxlength: [2000, 'Description cannot exceed 2000 characters']
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price cannot be negative']
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Product category is required']
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
            min: [0, 'Stock cannot be negative']
        },
        images: [{
            type: String
        }],
        ratings: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5
            },
            review: {
                type: String,
                maxlength: 500
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual for average rating
productSchema.virtual('averageRating').get(function () {
    if (!this.ratings || this.ratings.length === 0) {
        return 0;
    }
    const sum = this.ratings.reduce((acc, item) => acc + item.rating, 0);
    return Math.round((sum / this.ratings.length) * 10) / 10;
});

// Virtual for number of reviews
productSchema.virtual('numReviews').get(function () {
    return this.ratings ? this.ratings.length : 0;
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
