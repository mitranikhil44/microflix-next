import mongoose from 'mongoose';
import connectToDatabase from './database/db';
import { Contents } from './database/scrapeSchema';

export default async function handler(req, res) {
  await connectToDatabase(); // Establish the database connection

  const skip = parseInt(req.query.skip);
  const limit = parseInt(req.query.limit);
  const category = req.query.category || 'hollywood'; // Default category is 'hollywood'

  try {
    const validCategories = [
      "hollywood",
      'hollywood/movies',
      'hollywood/seasons',
      'hollywood/adult',
    ];
  
    if (!validCategories.includes(category)) {
      res.status(400).json({ error: 'Invalid category' });
      return;
    }
  
    let filterConditions = {};
  
    if (category === 'hollywood/movies') {
      filterConditions.title = { $not: /season/i };
    } else if (category === 'hollywood/seasons') {
      filterConditions.title = { $regex: /season/i, $options: 'i' };
    } else if (category === 'hollywood/adult') {
      filterConditions.title = { $regex: /18\+/i, $options: 'i' };
    }
  
    let Model;
    if (category === 'hollywood') {
      Model = Contents;
    }
  
    const query = Model ? Model.find(filterConditions).skip(skip).limit(limit) : null;
  
    if (!query) {
      res.status(400).json({ error: 'Invalid category' });
      return;
    }
  
    const filteredData = await query.exec();

    const response = {
      data: filteredData,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error while fetching data' });
  } finally {
    mongoose.connection.close();
  }
}
