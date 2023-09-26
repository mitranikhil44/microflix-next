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
  
      const filmHeaders = [];
      $('main.page-body p span em strong').each((index, element) => {
        const filmHeader = $(element).prop('outerHTML').replace("HDHub4u", "Microflix");
        filmHeaders.push(filmHeader);
      });
  
      const filmH3AnchorTags = [];
      $('main.page-body h3 a').each((index, element) => {
        const filmH3AnchorTag = $(element).prop('outerHTML').replace("<img", "<Image").replace("HDHub4u", "Microflix");
        filmH3AnchorTags.push(filmH3AnchorTag);
      });
  
      const filmH4AnchorTags = [];
      $('main.page-body h4 a').each((index, element) => {
        const filmH4AnchorTag = $(element).prop('outerHTML').replace("HDHub4u", "Microflix");
        filmH4AnchorTags.push(filmH4AnchorTag);
      });
  
      const filmPAnchorTags = [];
      $('main.page-body p a').each((index, element) => {
        const filmPAnchorTag = $(element).prop('outerHTML').replace("<img", "<Image").replace("HDHub4u", "Microflix");
        filmPAnchorTags.push(filmPAnchorTag);
      });
  
      const filmTrailers = [];
      $('main.page-body div.responsive-embed-container').each((index, element) => {
        const filmTrailer = $(element).prop('outerHTML').replace("HDHub4u", "Microflix");
        filmTrailers.push(filmTrailer);
      });
  
      const filmStorylines = [];
      $('main.page-body p em').each((index, element) => {
        const filmStoryline = $(element).prop('outerHTML').replace("HDHub4u", "Microflix");
        filmStorylines.push(filmStoryline);
      });
  
      const filmReviews = [];
      $('main.page-body div.show-more__control em').each((index, element) => {
        const filmReview = $(element).prop('outerHTML').replace("HDHub4u", "Microflix");
        filmReviews.push(filmReview);
      });
  
      // ... Repeat the process for other elements you want to scrape ...
  
      const slug = article.title.replace(/[^\w\s]/g, '').replace(/\s+/g, '_').toLowerCase();
  
      let existingArticle;
      let slugToUse = slug;
  
      existingArticle = await Contents.findOne({ slug: slugToUse });
  
      if (existingArticle) {
        await Contents.findOneAndUpdate({ url }, {
          title: article.title,
          image: article.image,
          slug: slugToUse,
          filmHeaders: filmHeaders,
          filmH3AnchorTags: filmH3AnchorTags,
          filmH4AnchorTags: filmH4AnchorTags,
          filmPAnchorTags: filmPAnchorTags,
          filmTrailers: filmTrailers,
          filmStorylines: filmStorylines,
          filmReviews: filmReviews,
        });
      } else {
        const newArticle = await new Contents({
          title: article.title,
          url,
          image: article.image,
          slug: slugToUse,
          filmHeaders: filmHeaders,
          filmH3AnchorTags: filmH3AnchorTags,
          filmH4AnchorTags: filmH4AnchorTags,
          filmPAnchorTags: filmPAnchorTags,
          filmTrailers: filmTrailers,
          filmStorylines: filmStorylines,
          filmReviews: filmReviews,
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
