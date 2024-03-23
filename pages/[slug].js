import Head from "next/head";
import Image from "next/image";

export default function BlogPost({myBlog}) {
  const content = myBlog;
  function createMarkup(content) {
    return { __html: content };
  }
  const contentSceens = content.contentSceens.map((img, index) => (
    `<div class="rounded-md p-2 hover:scale-95 w-64"><Image key=${index + 1} src=${img} height={100} width={100} /></div>`
  ));

  const screenshotsHTML = `
    <div class="flex justify-center items-center flex-wrap">
      ${contentSceens.join('')}
    </div>
  `;

  const data = content.content.toLowerCase();

  const indexOfScreenshots = data.indexOf("screenshots");
  const indexOfStory = data.indexOf("synopsis")

  const fullContentHTML = content.content.slice(0, indexOfScreenshots + 55) + screenshotsHTML + content.content.slice(indexOfScreenshots + 50);

  let extractedText = "";
  if (indexOfStory !== -1 && indexOfScreenshots !== -1) {
    extractedText += data.slice(indexOfStory + `synopsis/plot:</span></h3>
  <p>`.length - 2, indexOfScreenshots - `</p> <h2 style="text-align: center;"><span style="color: #eef425;">`.length);
  } else {
    console.error("Keywords not found in the content");
  }
  return (
    <>
      <head>
        <title>{myBlog.title}</title>
        <meta name="description" content={extractedText} />
        {/* Ads Script */}
        <script type='text/javascript' src='//pl17869772.toprevenuegate.com/84/84/ce/8484cef01a310a80e4ea6f32c0a15daa.js'></script>
      </head>
      <div
        className="flex flex-col justify-center items-center py-6 px-4 text-xs xs:text-sm md:text-base contentClass text-gray-700"
        dangerouslySetInnerHTML={createMarkup(fullContentHTML.replace(/VegaMovies/, "Microflix"))}
      ></div>
    </>
  );
}


export async function getServerSideProps(context) {
  const apiKey = process.env.API_KEY;
  try {
    const { slug } = context.query;
    const data = await fetch(`${apiKey}api/getblogs/?slug=${slug}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }, timeout: 15000
    });
    const myBlog = await data.json();
    return {
      props: { myBlog },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
