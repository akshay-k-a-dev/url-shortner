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
      let originalUrl = url;
      if (!/^https?/i.test(originalUrl)) {
        originalUrl = `https://${originalUrl}`;
      }
      
      // Use our proxy endpoint instead of calling is.gd directly
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: originalUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to shorten URL');
      }

      const data = await response.json();
      const newUrl = data.shortUrl;

      const storedUrls = JSON.parse(localStorage.getItem("shorty-urls") || "[]");
      const newStoredUrl = {
        original: originalUrl,
        slug: newUrl.split('/').pop(),
        shortUrl: newUrl,
        clicks: 0,
        _creationTime: Date.now(),
        _id: Math.random().toString(36).substring(2, 12),
      };
      localStorage.setItem("shorty-urls", JSON.stringify([...storedUrls, newStoredUrl]));

      setShortenedUrl(newUrl);
      toast.success("URL shortened successfully!");
    } catch (error: any) {
      toast.error(error.message || "An unknown error occurred.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortenedUrl);
    toast.success("Copied to clipboard!");
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