import mongoose from 'mongoose';

const scrapeSchema = new mongoose.Schema({
    title: String,
    slug: String,
    url: String,
    image: String,
    content: String,
});

export const Contents =  mongoose.models.Contents || mongoose.model('Contents', scrapeSchema);