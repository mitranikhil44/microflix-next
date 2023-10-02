import mongoose from 'mongoose';
import connectToDatabase from './database/db';
import { Contents } from './database/scrapeSchema';

export default async function handler(req, res) {
  await connectToDatabase();

  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 12;
  const category = req.query.category || 'content';

  try {
    const validCategories = [
      'contents',
      'content_movies',
      'content_seasons',
      'content_adult',
      'top_contents',
      'top_content_movies',
      'top_content_seasons',
      'top_content_adult',
    ];

    if (!validCategories.includes(category)) {
      res.status(400).json({ error: 'Invalid category' });
      return;
    }

    let response = [];

    if (
      category === 'content_movies' ||
      category === 'content_seasons' ||
      category === 'content_adult' ||
      category === 'contents'
    ) {
      // Fetch data based on category
      let filterConditions = {};

      if (category === 'content_movies') {
        filterConditions.title = { $not: /season/i };
      } else if (category === 'content_seasons') {
        filterConditions.title = { $regex: /season/i };
      } else if (category === 'content_adult') {
        filterConditions.title = { $regex: /18\+/i };
      } else if (category === 'contents') {
        // No specific filter for 'content' category
      }

      // Include IMDb rankings where available
      const data = await Contents.find({ ...filterConditions})
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec();

      response.push({
        data,
        currentPage: page,
        pageSize,
      });
    }

    // Handle "top_content" categories separately
    if (
      category === 'top_content_movies' ||
      category === 'top_content_seasons' ||
      category === 'top_content_adult' ||
      category === 'top_contents'
    ) {
      // Fetch data for "top_content" categories here
      let topFilterConditions = {};

      if (category === 'top_content_movies') {
        topFilterConditions.title = { $not: /season/i };
      } else if (category === 'top_content_seasons') {
        topFilterConditions.title = { $regex: /season/i };
      } else if (category === 'top_content_adult') {
        topFilterConditions.title = { $regex: /18\+/i };
      } else if (category === 'top_contents') {
        // No specific filter for 'top_content' category
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
