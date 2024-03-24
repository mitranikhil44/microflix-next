const FetchSSRData = async (page, category) => {
  try {
    const apiKey = process.env.API_KEY;
    const response = await fetch(`${apiKey}/api/blogs?category=${category}&page=${page}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' 
      },
    });
    const contents = await response.json();
    return contents;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

export default FetchSSRData;
