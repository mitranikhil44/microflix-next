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

      const ratingElements = $(content).find('span').filter(function () {
        return /Rating:/i.test($(this).text());
      });

      const imdbRatings = [];

      ratingElements.each(function () {
        const ratingSpan = $(this);
        const imdbRating = ratingSpan.parent().find('span').text().trim();
        const cleanedRating = imdbRating.replace(/\/10$/, '');
        imdbRatings.push(cleanedRating);
      });

      const slug = article.title.replace(/[^\w\s]/g, '').replace(/\s+/g, '_').toLowerCase();

      let existingArticle;
      let slugToUse = slug;

      existingArticle = await Contents.findOne({ slug: slugToUse });

      if (existingArticle) {
        await Contents.updateOne({ url }, {
          title: article.title,
          imdb: imdbRatings, 
          url,
          slug: article.slug,
          image: article.image,
          content: content
        });
      }
       else {
        const newArticle = await Contents.create({
          title: article.title,
          imdb: imdbRatings,
          url,
          image: article.image,
          slug: slug,
          content: content
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

  async function processPages() {
    const pageNumbers = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);

    for (const pageNumber of pageNumbers) {
      await scrapePage(pageNumber);
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
