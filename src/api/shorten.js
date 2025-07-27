export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const encodedUrl = encodeURIComponent(url);
    const apiUrl = `https://is.gd/create.php?format=simple&url=${encodedUrl}`;

    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error('Failed to shorten URL');
    }

    const shortUrl = await response.text();

    if (shortUrl.startsWith('Error')) {
      throw new Error(shortUrl);
    }

    res.status(200).json({ shortUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
