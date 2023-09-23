import connectToDatabase from './database/db';
import { Contents } from './database/scrapeSchema';

export default async function handler(req, res) {
    try {
        await connectToDatabase(); // Establish the database connection

        const { slug } = req.query;

        // Query both the "Hollywood" and "Bollywood" collections for data with the matching slug
        const hollywoodData = await Contents.findOne({ slug });

        if (hollywoodData) {
            const jsonData = hollywoodData;
            res.status(200).json(jsonData);
        } else {
            res.status(404).json({ error: 'No Blogs Found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
}
