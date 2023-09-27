import mongoose from 'mongoose';

const scrapeSchema = new mongoose.Schema({
    "_id": {
        "$oid": "ObjectId" 
    },
    "title": "String", 
    "url": "String", 
    "image": "String", 
    "slug": "String", 
    "content": "String",
}
);

export const Contents = mongoose.models.Contents || mongoose.model('Contents', scrapeSchema);
