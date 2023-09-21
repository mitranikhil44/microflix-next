import axios from 'axios';
import cheerio from 'cheerio';
import connectToDatabase from './database/db';
import { Contents } from './database/models';

const BASE_URL = 'https://hdhub4u.markets/page/';
const TOTAL_PAGES = 788;

(async () => {
  await connectToDatabase();

  async function processArticle(article, Model) {
    const { url } = article;

    try {
      const contentResponse = await axios.get(url);
      const responseContent$ = cheerio.load(contentResponse.data);
      const content = responseContent$('main.page-body').html();

      if (!content) {
        console.error('Error: Content is empty for URL:', url);
        return;
      }

      const existingArticle = await Model.findOne({ slug: article.slug });

      const transformedContent = content.replace(/HDHub4u/gi, 'Microflix').replace(/<img>/gi, '<Image>');

      if (existingArticle) {
        await Model.findOneAndUpdate({ url }, {
          title: article.title,
          image: article.image,
          slug: article.slug,
          content: transformedContent,
        });
      } else {
        const newArticle = new Model({
          title: article.title,
          url,
          image: article.image,
          slug: article.slug,
          content: transformedContent,
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

      const articlePromises = $('section.home-wrapper ul li').map(async (index, element) => {
        const titleElement = $(element).find('p');
        const title = titleElement ? titleElement.text().trim() : '';
        const articleUrl = $(element).find('a').attr('href');
        const imageElement = $(element).find('img[src]');
        const image = imageElement.length > 0 ? imageElement.attr('src') : '';
        const slug = title.replace(/[^\w\s]/g, '').replace(/\s+/g, '_').toLowerCase();

        return { title, url: articleUrl, image, slug };
      }).get();

      return Promise.all(articlePromises);
    } catch (error) {
      console.error(`Error scraping page ${pageNumber}:`, error.message);
      return [];
    }
  }

  async function processPage(pageNumber) {
    const articles = await scrapePage(pageNumber);
    for (const article of articles) {
      await processArticle(article, Contents);
    }

    // Continue to the next page if there are more pages
    if (pageNumber < TOTAL_PAGES) {
      await processPage(pageNumber + 1);
    }
  }

  try {
    // Start scraping from the first page
    await processPage(1);

    console.log('Scraping and processing completed.');
  } catch (error) {
    console.error('Error:', error.message);
    console.log('Error occurred during scraping.');
  }
})();
