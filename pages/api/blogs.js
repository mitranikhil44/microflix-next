import mongoose from 'mongoose';
import connectToDatabase from './database/db';
import { Contents } from './database/scrapeSchema';

export default async function handler(req, res) {
  await connectToDatabase();

  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const category = req.query.category || 'hollywood';

  try {
    const validCategories = [
      'hollywood',
      'hollywood_movies',
      'hollywood_seasons',
      'hollywood_adult',
      'top_hollywood',
      'top_hollywood_movies',
      'top_hollywood_seasons',
      'top_hollywood_adult',
    ];

    if (!validCategories.includes(category)) {
      res.status(400).json({ error: 'Invalid category' });
      return;
    }

    let response = [];

    if (
      category === 'hollywood_movies' ||
      category === 'hollywood_seasons' ||
      category === 'hollywood_adult' ||
      category === 'hollywood'
    ) {
      // Fetch data based on category
      let filterConditions = {};

      if (category === 'hollywood_movies') {
        filterConditions.title = { $not: /season/i };
      } else if (category === 'hollywood_seasons') {
        filterConditions.title = { $regex: /season/i };
      } else if (category === 'hollywood_adult') {
        filterConditions.title = { $regex: /18\+/i };
      } else if (category === 'hollywood') {
        // No specific filter for 'hollywood' category
      }

      // Include IMDb rankings where available
      const data = await Contents.find({ ...filterConditions, imdb: { $exists: true } })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec();

      response.push({
        data,
        currentPage: page,
        pageSize,
      });
    }

    // Handle "top_hollywood" categories separately
    if (
      category === 'top_hollywood_movies' ||
      category === 'top_hollywood_seasons' ||
      category === 'top_hollywood_adult' ||
      category === 'top_hollywood'
    ) {
      // Fetch data for "top_hollywood" categories here
      let topFilterConditions = {};

      if (category === 'top_hollywood_movies') {
        topFilterConditions.title = { $not: /season/i };
      } else if (category === 'top_hollywood_seasons') {
        topFilterConditions.title = { $regex: /season/i };
      } else if (category === 'top_hollywood_adult') {
        topFilterConditions.title = { $regex: /18\+/i };
      } else if (category === 'top_hollywood') {
        // No specific filter for 'top_hollywood' category
      }

      // Include IMDb rankings where available
      const topData = await Contents.find({ ...topFilterConditions, imdb: { $exists: true } })
      .sort({ imdb: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec();

      response.push({
        data: topData,
        currentPage: page,
        pageSize,
      });
    }

    // Only respond with data if one of the valid categories matched
    if (response.length > 0) {
      res.status(200).json(response);
    } else {
      res.status(400).json({ error: 'Invalid category' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error while fetching data' });
  } finally {
    mongoose.connection.close();
  }
}
