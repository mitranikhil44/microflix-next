import connectToDatabase from '../../lib/mongodb';
import { Contents } from '../../models/scrapeSchema';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await connectToDatabase(); // Establish the database connection

            const { slug } = req.query;
            const data = await Contents.findOne({ slug });

            if (data) {
                const jsonData = data;
                res.status(200).json(jsonData);
            } else {
                res.status(404).json({ error: 'No Blogs Found' });
            }
        } catch (error) {
            console.error('Error:', error);
        res.status(500).json({ error: 'Error fetching data' });
        }
    }
}
