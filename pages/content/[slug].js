export default function BlogPost(props) {
  function createMarkup(content) {
    return { __html: content };
  }

  return (
    <div className="flex flex-col justify-center items-center py-6 px-4">
      <div>
        <div className="text-xs xs:text-sm md:text-base contentClass space-y-6 text-gray-700 gap-4" dangerouslySetInnerHTML={createMarkup(props.myBlog.content)}></div>
      </div>
      <div>
      </div>
    </div>
  );
}


export async function getServerSideProps(context) {
  const apiKey = process.env.API_KEY;
  try {
    const { slug } = context.query;
    const data = await fetch(`${apiKey}api/getblogs/?slug=${slug}`);
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
