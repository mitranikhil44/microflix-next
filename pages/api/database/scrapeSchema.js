import mongoose from 'mongoose';

const scrapeSchema = new mongoose.Schema({
    "title": "String", 
    "imdb": "String",
    "url": "String", 
    "image": "String", 
    "slug": "String", 
    "content": "String",
}
);

export const Contents = mongoose.models.Contents || mongoose.model('Contents', scrapeSchema);
