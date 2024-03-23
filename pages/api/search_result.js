import connectToDatabase from "../../lib/mongodb";
import { Contents } from "../../models/scrapeSchema";
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await connectToDatabase();

      const query = req.query.query || '';
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 12;

      const skip = (page - 1) * pageSize;

      // Get total count without applying skip and limit
      const totalCount = await Contents.countDocuments({
        title: { $regex: new RegExp(query, "i") },
      });

      // Fetch suggestions with skip and limit
      const suggestions = await Contents.find({
        title: { $regex: new RegExp(query, "i") },
      }).skip(skip)
        .limit(pageSize);

      const response = suggestions.map((suggestion) => suggestion);

      res.status(200).json({ totalData: totalCount, data: response }
      );
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error while fetching suggestions' });
    }
  }
}
