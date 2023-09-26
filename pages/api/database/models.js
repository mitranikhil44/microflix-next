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
    filmHeaders: [{
        type: String,
    }],
    filmH3AnchorTags: [{
        type: String,
    }],
    filmH4AnchorTags: [{
        type: String,
    }],
    filmPAnchorTags: [{
        type: String,
    }],
    filmTrailers: [{
        type: String,
    }],
    filmStorylines: [{
        type: String,
    }],
    filmReviews: [{
        type: String,
    }],
    filmDescriptions: [{
        type: String,
    }],
});

export const Contents = mongoose.models.Contents || mongoose.model('Contents', contentSchema);
