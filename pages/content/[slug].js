import Image from "next/image";

export default function BlogPost(props) {
  function createMarkup(content) {
    return { __html: content };
  }

  return (
    <div className="flex flex-col justify-center items-center py-6 px-4">
      <div>
        <div className="text-xs xs:text-sm md:text-base contentClass space-y-6 text-gray-700 gap-4">
          {/* Render filmHeaders */}
          {props.myBlog.content.filmHeaders.map((header, index) => (
            <h2 key={index} dangerouslySetInnerHTML={createMarkup(header)}></h2>
          ))}

          {/* Render filmH3AnchorTags */}
          {props.myBlog.content.filmH3AnchorTags.map((tag, index) => (
            <h3 key={index} dangerouslySetInnerHTML={createMarkup(tag)}></h3>
          ))}

          {/* Render filmH4AnchorTags */}
          {props.myBlog.content.filmH4AnchorTags.map((tag, index) => (
            <h3 key={index} dangerouslySetInnerHTML={createMarkup(tag)}></h3>
          ))}

          {/* Render filmPAnchorTags */}
          {props.myBlog.content.filmPAnchorTags.map((tag, index) => (
            <p key={index} dangerouslySetInnerHTML={createMarkup(tag)}></p>
          ))}

          {/* Render filmTrailers */}
          {props.myBlog.content.filmTrailers.map((trailer, index) => (
            <div key={index} dangerouslySetInnerHTML={createMarkup(trailer)}></div>
          ))}

          {/* Render filmStorylines */}
          {props.myBlog.content.filmStorylines.map((storyline, index) => (
            <p key={index} dangerouslySetInnerHTML={createMarkup(storyline)}></p>
          ))}

          {/* Render filmReviews */}
          {props.myBlog.content.filmReviews.map((review, index) => (
            <div key={index} dangerouslySetInnerHTML={createMarkup(review)}></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const apiKey = process.env.API_KEY;
  try {
    const { slug } = context.query;
    const data = await fetch(`${apiKey}api/getblogs/?slug=${slug}`, { timeout: 15000 });
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
