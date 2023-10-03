import axios from 'axios';
import cheerio from 'cheerio';
import connectToDatabase from './database/db';
import { Contents } from './database/models';

const BASE_URL = 'https://hdhub4u.markets/page/';
const TOTAL_PAGES = 791;

(async () => {
  await connectToDatabase();

  async function processArticle(article) {
    const { url } = article;
 
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      const contentElement = $('main.page-body');
      if (!contentElement.length) {
        console.error('Content element not found for article:', article.title);
        return;
      }

      const content = contentElement.html().replace(/HDHub4u/g, (match, offset, input) => {
        const srcIndex = input.lastIndexOf('src="', offset);

        if (srcIndex === -1 || input.indexOf('"', srcIndex + 5) < offset) {
          return 'Microflix';
        } else {
          return match;
        }
      });

      const ratingElements = $(content).find(`div div span[style="font-family: 'Open Sans';"]`).filter(function () {
        const text = $(this).text().trim();
        return /\/10|\d+\.\d+/i.test(text); 
      });      
      
      const imdbRatings = [];
      
      ratingElements.each(function () {
        const ratingSpan = $(this);
        const imdbRating = ratingSpan.text().trim();
        let cleanedRating = imdbRating.replace(/\/10$/, ''); 
        cleanedRating = cleanedRating.replace(/iMDB Rating:|iMDB Rating:|Rating:/i, '').trim(); 
        imdbRatings.push(cleanedRating);
      });

      const slug = article.title.replace(/[^\w\s]/g, '').replace(/\s+/g, '_').toLowerCase();

      const existingArticle = await Contents.findOne({ url });
  
      if (existingArticle) {
        await Contents.findOneAndUpdate(
          { url },
          {
            title: article.title,
            imdb: imdbRatings,
            url,
            slug: slug,
            image: article.image,
            content: content,
            updatedAt: Date.now(), 
          }
        );
      } else {
        const newArticle = new Contents({
          title: article.title,
          imdb: imdbRatings,
          url,
          slug: slug,
          image: article.image,
          content: content,
          updatedAt: Date.now(), 
        });
        await newArticle.save();
      }
    } catch (error) {
      console.error('Error processing article:', error.message);
    }
  }

  async function scrapePage(pageNumber) {
    const url = `${BASE_URL}${pageNumber}/`;
    console.log(`Scraping page no. ${pageNumber}`);

    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      const articles = [];

      $('section.home-wrapper ul li').each((index, element) => {
        const title = $(element).find('p').text();
        const articleUrl = $(element).find('a').attr('href');
        const image = $(element).find('img[src]').attr('src');

        articles.push({ title, url: articleUrl, image });
      });

      for (const article of articles) {
        await processArticle(article);
      }
    } catch (error) {
      console.error(`Error scraping page ${pageNumber}:`, error.message);
    }
  }

  async function processPages(startPage = 1) {
    const pageNumbers = Array.from({ length: TOTAL_PAGES }, (_, i) => startPage + i);
  
    const promises = pageNumbers.map(pageNumber => scrapePage(pageNumber));
  
    try {
      await Promise.all(promises);
      console.log('Scraping and processing completed.');
    } catch (error) {
      console.error('Error:', error.message);
      console.log('Error occurred during scraping.');
    }
  }
  

  try {
    await processPages();
    console.log('Scraping and processing completed.');
  } catch (error) {
    console.error('Error:', error.message);
    console.log('Error occurred during scraping.');
  }
})();
