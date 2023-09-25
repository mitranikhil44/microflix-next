import mongoose from 'mongoose';

const scrapeSchema = new mongoose.Schema({
    title: String,
    slug: String,
    url: String,
    image: String,
    content: {
        filmHeaders: String,
        filmH3AnchorTags: String,
        filmH4AnchorTags: String,
        filmPAnchorTags: String,
        filmTrailers: String,
        filmStorylines: String,
        filmReviews: String
    },
});

export const Contents =  mongoose.models.Contents || mongoose.model('Contents', scrapeSchema);