import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            unique: true,
            trim: true,
            maxlength: [100, 'Category name cannot exceed 100 characters']
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true
        },
        description: {
            type: String,
            maxlength: [500, 'Description cannot exceed 500 characters']
        },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            default: null
        },
        image: {
            type: String // Cloudinary URL
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

// Virtual for children categories
categorySchema.virtual('children', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parent'
});

// Generate slug from name before saving
categorySchema.pre('save', function (next) {
    if (this.isModified('name') && !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }
    next();
});

// Indexes
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1 });

const Category = mongoose.model('Category', categorySchema);

export default Category;
