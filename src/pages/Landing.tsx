import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Link as LinkIcon, Copy } from "lucide-react";
import { Link } from "react-router";

export default function Landing() {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setShortenedUrl("");
    
    try {
      // Validate URL format
      let originalUrl = url.trim();
      if (!originalUrl) {
        throw new Error("Please enter a URL");
      }

      // Add protocol if missing
      if (!/^https?:\/\//i.test(originalUrl)) {
        originalUrl = `https://${originalUrl}`;
      }

      // Basic URL validation
      try {
        new URL(originalUrl);
      } catch {
        throw new Error("Please enter a valid URL");
      }

      let newUrl;
      let isLocalUrl = false;
      let errorMessage = "";

      try {
        // Try our proxy endpoint first
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch('/api/shorten', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: originalUrl }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.shortUrl) {
          throw new Error("Invalid response from shortening service");
        }

        newUrl = data.shortUrl.trim();
        
        // Validate the shortened URL
        if (!newUrl.startsWith('http')) {
          throw new Error("Invalid shortened URL received");
        }

      } catch (proxyError) {
        console.warn("Proxy API failed:", proxyError);
        
        if (proxyError.name === 'AbortError') {
          errorMessage = "Request timed out. Using local fallback.";
        } else if (proxyError.message.includes('fetch')) {
          errorMessage = "Network error. Using local fallback.";
        } else {
          errorMessage = `API error: ${proxyError.message}. Using local fallback.`;
        }

        // Fallback: create a local short URL
        const slug = Math.random().toString(36).substring(2, 8);
        newUrl = `${window.location.origin}/s/${slug}`;
        isLocalUrl = true;
        
        // Store the mapping for local redirect
        try {
          const redirects = JSON.parse(localStorage.getItem("shorty-redirects") || "{}");
          redirects[slug] = originalUrl;
          localStorage.setItem("shorty-redirects", JSON.stringify(redirects));
        } catch (storageError) {
          console.error("Failed to save redirect mapping:", storageError);
          throw new Error("Failed to create fallback URL");
        }

        // Show warning toast for fallback
        toast.warning(errorMessage);
      }

      // Store URL in history
      try {
        const storedUrls = JSON.parse(localStorage.getItem("shorty-urls") || "[]");
        const newStoredUrl = {
          original: originalUrl,
          slug: isLocalUrl ? newUrl.split('/').pop() : newUrl.split('/').pop(),
          shortUrl: newUrl,
          clicks: 0,
          isLocal: isLocalUrl,
          _creationTime: Date.now(),
          _id: Math.random().toString(36).substring(2, 12),
        };
        
        // Limit stored URLs to prevent localStorage overflow
        const updatedUrls = [newStoredUrl, ...storedUrls].slice(0, 100);
        localStorage.setItem("shorty-urls", JSON.stringify(updatedUrls));
      } catch (storageError) {
        console.warn("Failed to save URL to history:", storageError);
        // Don't throw error here as the URL was still shortened successfully
      }

      setShortenedUrl(newUrl);
      setUrl(""); // Clear input on success
      
      if (!errorMessage) {
        toast.success("URL shortened successfully!");
      }

    } catch (error) {
      console.error("URL shortening failed:", error);
      
      let userMessage = "Failed to shorten URL";
      
      if (error.message.includes("valid URL")) {
        userMessage = error.message;
      } else if (error.message.includes("network") || error.message.includes("fetch")) {
        userMessage = "Network error. Please check your connection and try again.";
      } else if (error.message.includes("timeout")) {
        userMessage = "Request timed out. Please try again.";
      } else if (error.message) {
        userMessage = error.message;
      }
      
      toast.error(userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortenedUrl);
      toast.success("Copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
      
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = shortenedUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success("Copied to clipboard!");
      } catch (fallbackError) {
        toast.error("Failed to copy to clipboard. Please copy manually.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 space-y-6"
      >
        {/* Logo and Title */}
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-500 rounded-lg">
            <LinkIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Shorty</h1>
        </div>

        {/* Subtitle */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700">The Easiest URL Shortener.</h2>
          <p className="text-sm text-gray-500">
            Create short, memorable links in seconds. Perfect for sharing on social media, in emails, or anywhere you need a compact link.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            type="text"
            placeholder="Enter your URL (e.g., google.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            disabled={isLoading}
          >
            {isLoading ? "..." : "Shorten"}
          </Button>
        </form>

        {/* Shortened URL Display */}
        {shortenedUrl && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center gap-3 p-3 bg-gray-100 border border-gray-200 rounded-md"
          >
            <a
              href={shortenedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-medium truncate flex-1 hover:underline"
            >
              {shortenedUrl}
            </a>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleCopy}
              className="text-gray-500 hover:bg-gray-200 rounded-lg"
            >
              <Copy className="h-5 w-5" />
            </Button>
          </motion.div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400">Copyleft © {new Date().getFullYear()}. All wrongs reserved.</p>
            <Button asChild variant="link" className="text-xs text-blue-500 p-0 h-auto">
                <Link to="/dashboard">My Links</Link>
            </Button>
        </div>
      </motion.div>
    </div>
  );
}