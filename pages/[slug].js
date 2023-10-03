import Head from "next/head";
import Image from "next/image";

export default function BlogPost(props) {
  function createMarkup(content) {  
    return { __html: content };
  }
  

  return (
      <>
      <Head>
        <title>{props.myBlog.title}</title>
      </Head>
        <div className="flex flex-col justify-center items-center py-6 px-4 text-xs xs:text-sm md:text-base contentClass text-gray-700" dangerouslySetInnerHTML={createMarkup(props.myBlog.content)}>
        </div>
      </>
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
