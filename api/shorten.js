export default async function handler(req, res) {
  // Comprehensive CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

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

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; URL-Shortener/1.0)',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to shorten URL');
    }

    const shortUrl = await response.text();

    if (shortUrl.startsWith('Error')) {
      throw new Error(shortUrl);
    }

    res.status(200).json({ shortUrl: shortUrl.trim() });
  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}