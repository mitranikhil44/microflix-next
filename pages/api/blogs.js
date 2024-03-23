import mongoose from 'mongoose';
import connectToDatabase from '../../lib/mongodb';
import { Contents } from '../../models/scrapeSchema';

export default async function handler(req, res) {
  if (req.method === 'POST') {
  await connectToDatabase();
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 12;
  const category = req.query.category || 'contents'; try {
    const validCategories = [
      'contents',
      'content_movies',
      'content_seasons',
      'content_adult',
      'top_contents',
      'top_content_movies',
      'top_content_seasons',
      'top_content_adult',
      'latest_contents',
    ];

    if (!validCategories.includes(category)) {
      res.status(400).json({ error: 'Invalid category' });
      return;
    }
    let response = [];

    if (category === 'latest_contents') {
      const sortedData = await Contents.find()
        .sort({ "imdbDetails.formattedDateObject": -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize);
      const totalPages = Math.ceil(await Contents.countDocuments({}) / pageSize);

      response.push({
        data: sortedData,
        currentPage: page,
        pageSize,
        totalPages,
      });
    }

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

      const query = Contents.find({ ...filterConditions }).sort({ updatedAt: 1 })

      // Apply pagination
      query.skip((page - 1) * pageSize).limit(pageSize);
      const totalCount = await Contents.countDocuments(filterConditions);
      const totalPages = Math.ceil(totalCount / pageSize);
      const data = await query.exec();

      response.push({
        data,
        currentPage: page,
        pageSize,
        totalPages,
      });
    }

    // Handle "top_content" categories separately
    if (
      category === 'top_content_movies' ||
      category === 'top_content_seasons' ||
      category === 'top_content_adult' ||
      category === 'top_contents'
    ) {

      let topFilterConditions = {};

      if (category === 'top_content_movies') {
        topFilterConditions.title = { $not: /season/i };
      } else if (category === 'top_content_seasons') {
        topFilterConditions.title = { $regex: /season/i };
      } else if (category === 'top_content_adult') {
        topFilterConditions.title = { $regex: /18\+/i };
      }

      const aggregationPipeline = [
        {
          $match: topFilterConditions,
        },
        {
          $sort: { "imdbDetails.imdbRating.rating": -1 },
        },
        {
          $skip: (page - 1) * pageSize,
        },
        {
          $limit: pageSize,
        },
      ];

      const topData = await Contents.aggregate(aggregationPipeline).exec();
      const totalCount = await Contents.countDocuments(topFilterConditions);
      const totalPages = Math.ceil(totalCount / pageSize);

      response.push({
        data: topData,
        currentPage: page,
        pageSize,
        totalPages,
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
}
