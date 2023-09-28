import mongoose from 'mongoose';
import connectToDatabase from './database/db';
import { Contents } from './database/scrapeSchema';

export default async function handler(req, res) {
  await connectToDatabase();

  const page = parseInt(req.query.page) || 1; // Default to page 1
  const pageSize = parseInt(req.query.pageSize) || 20; // Default page size
  const category = req.query.category || 'hollywood';
  const ranking = req.query.ranking || 'latest';

  try {
    const validCategories = [
      "hollywood",
      'hollywood/movies',
      'hollywood/seasons',
      'hollywood/adult',
    ];

    const validRankings = [
      'latest',
      'top_movies',
      'top_seasons',
    ];

    if (!validCategories.includes(category) || !validRankings.includes(ranking)) {
      res.status(400).json({ error: 'Invalid category or ranking' });
      return;
    }

    let filterConditions = {};

    if (category === 'hollywood/movies') {
      filterConditions.title = { $not: /season/i };
    } else if (category === 'hollywood/seasons') {
      filterConditions.title = { $regex: /season/i };
    } else if (category === 'hollywood/adult') {
      filterConditions.title = { $regex: /18\+/i };
    } 
    // else if(category === "hollywood/movies/" && ranking === "top_seasons"){
    //   const movieContent = filterConditions.title = { $not: /season/i };
    //   movieContent.content = {$regex: /5.6/i};
    // } 

    // Calculate skip and limit based on page and pageSize
    const skip = (page - 1) * pageSize;
    const limit = pageSize;

    let Model = Contents;
    const query = Model ? Model.find(filterConditions).skip(skip).limit(limit) : null;

    if (!query) {
      res.status(400).json({ error: 'Invalid category' });
      return;
    }

    const filteredData = await query.exec();

    const response = {
      data: filteredData,
      currentPage: page,
      pageSize: pageSize,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error while fetching data' });
  } finally {
    mongoose.connection.close();
  }
}
