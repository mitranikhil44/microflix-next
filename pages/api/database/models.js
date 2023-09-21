import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    slug: {
        type: String,
    },
    content: {
        type: String,
    },
});

export const Contents =  mongoose.models.Contents || mongoose.model('Contents', contentSchema);
