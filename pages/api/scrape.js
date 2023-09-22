import puppeteer from 'puppeteer';
import connectToDatabase from './database/db';
import { Contents } from './database/models';

const BASE_URL = 'https://hdhub4u.markets/page/';
const TOTAL_PAGES = 788;

(async () => {
  await connectToDatabase();
  const browser = await puppeteer.launch();

  async function processArticle(article, Model, page) {
    const { url } = article;

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      const contentElement = await page.$('main.page-body');

      if (!contentElement) {
        console.error('Error: Content is empty for URL:', url);
        return;
      }

      const content = await page.evaluate((element) => element.innerHTML, contentElement);

      const slug = article.title.replace(/[^\w\s]/g, '').replace(/\s+/g, '_').toLowerCase(); // Generate the slug as a string

      let existingArticle;
      let slugToUse = slug;

      existingArticle = await Model.findOne({ slug: slugToUse });

      const transformedContent = content
        .replace(/HDHub4u/gi, 'Microflix')
        .replace(/<img>/gi, '<Image>');

      if (existingArticle) {
        await Model.findOneAndUpdate({ url }, {
          title: article.title,
          image: article.image,
          slug: slugToUse,
          content: transformedContent,
        });
      } else {
        const newArticle = new Model({
          title: article.title,
          url,
          image: article.image,
          slug: slugToUse,
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
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      const articleElements = await page.$$('section.home-wrapper ul li');

      const articles = [];

      for (const element of articleElements) {
        const titleElement = await element.$('p');
        const title = titleElement ? await page.evaluate((el) => el.textContent, titleElement) : '';
        const articleUrlElement = await element.$('a');
        const articleUrl = articleUrlElement ? await page.evaluate((a) => a.href, articleUrlElement) : '';
        const imageElement = await element.$('img[src]');
        const image = imageElement ? await page.evaluate((img) => img.src, imageElement) : '';

        articles.push({ title, url: articleUrl, image });
      }

      for (const article of articles) {
        await processArticle(article, Contents, page);
      }

      await page.close();
    } catch (error) {
      console.error(`Error scraping page ${pageNumber}:`, error.message);
    }
  }

  async function processPage(pageNumber) {
    await scrapePage(pageNumber);

    // Continue to the next page if there are more pages
    if (pageNumber < TOTAL_PAGES) {
      await processPage(pageNumber + 1);
    }
  }

  try {
    await processPage(1);
    console.log('Scraping and processing completed.');
  } catch (error) {
    console.error('Error:', error.message);
    console.log('Error occurred during scraping.');
  } finally {
    await browser.close();
  }
})();
