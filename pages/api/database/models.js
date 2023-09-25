import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    url: {
        type: String,
    },
    image: {
        type: String,
    },
    slug: {
        type: String,
    },
    content: {
    },
});

export const Contents =  mongoose.models.Contents2 || mongoose.model('Contents', contentSchema);
