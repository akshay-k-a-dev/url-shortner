export default async function handler(req, res) {
  try {
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
      return res.status(405).json({ 
        error: 'Method not allowed',
        message: 'Only POST requests are supported'
      });
    }

    // Validate request body
    if (!req.body) {
      return res.status(400).json({ 
        error: 'Missing request body',
        message: 'Request body is required'
      });
    }

    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ 
        error: 'URL is required',
        message: 'Please provide a URL to shorten'
      });
    }

    if (typeof url !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid URL format',
        message: 'URL must be a string'
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (urlError) {
      return res.status(400).json({ 
        error: 'Invalid URL',
        message: 'Please provide a valid URL'
      });
    }

    // Check URL length
    if (url.length > 2048) {
      return res.status(400).json({ 
        error: 'URL too long',
        message: 'URL must be less than 2048 characters'
      });
    }

    try {
      const encodedUrl = encodeURIComponent(url);
      const apiUrl = `https://is.gd/create.php?format=simple&url=${encodedUrl}`;

      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; URL-Shortener/1.0)',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`is.gd API returned status ${response.status}`);
      }

      const shortUrl = await response.text();

      // Handle is.gd error responses
      if (shortUrl.startsWith('Error')) {
        let errorMessage = 'Failed to shorten URL';
        
        if (shortUrl.includes('Error: Please enter a valid URL')) {
          errorMessage = 'Invalid URL provided';
        } else if (shortUrl.includes('Error: Sorry, the URL you entered is on our internal blacklist')) {
          errorMessage = 'URL is blacklisted by the shortening service';
        } else if (shortUrl.includes('Error: Sorry, the URL you entered is a suspected phishing site')) {
          errorMessage = 'URL flagged as potential phishing site';
        } else if (shortUrl.includes('Error: Sorry, we cannot shorten that URL')) {
          errorMessage = 'URL cannot be shortened by this service';
        }
        
        return res.status(400).json({ 
          error: errorMessage,
          message: shortUrl
        });
      }

      const trimmedUrl = shortUrl.trim();
      
      // Validate the response
      if (!trimmedUrl || !trimmedUrl.startsWith('http')) {
        throw new Error('Invalid response from is.gd API');
      }

      res.status(200).json({ 
        shortUrl: trimmedUrl,
        original: url,
        service: 'is.gd'
      });

    } catch (fetchError) {
      console.error('Error calling is.gd API:', fetchError);
      
      let errorMessage = 'Failed to shorten URL';
      let statusCode = 500;
      
      if (fetchError.name === 'AbortError') {
        errorMessage = 'Request to shortening service timed out';
        statusCode = 408;
      } else if (fetchError.message.includes('fetch')) {
        errorMessage = 'Unable to connect to shortening service';
        statusCode = 503;
      } else if (fetchError.message.includes('network')) {
        errorMessage = 'Network error occurred';
        statusCode = 503;
      }
      
      res.status(statusCode).json({ 
        error: errorMessage,
        message: fetchError.message,
        service: 'is.gd'
      });
    }

  } catch (serverError) {
    console.error('Server error:', serverError);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    });
  }
}