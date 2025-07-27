// TODO: THIS IS THE LANDING PAGE THAT THE USER WILL ALWAYS FIRST SEE. make sure to update this page
// Make sure that the marketing text always reflects the app marketing. create an aesthetic properly-designed landing page that fits the theme of the app
// start completely from scratch to make this landing page using aesthetic design principles and tailwind styling to create a unique and thematic landing page.

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let originalUrl = url;
      if (!/^https/i.test(originalUrl) && !/^http/i.test(originalUrl)) {
        originalUrl = `https://${originalUrl}`;
      }
      // Validate URL
      new URL(originalUrl);

      const slug = Math.random().toString(36).substring(2, 8);
      const newUrl = `${window.location.origin}/s/${slug}`;
      
      const storedUrls = JSON.parse(localStorage.getItem("shorty-urls") || "[]");
      const newStoredUrl = {
        original: originalUrl,
        slug,
        clicks: 0,
        _creationTime: Date.now(),
        _id: Math.random().toString(36).substring(2, 12),
      };
      localStorage.setItem("shorty-urls", JSON.stringify([...storedUrls, newStoredUrl]));

      setShortenedUrl(newUrl);
      toast.success("URL shortened successfully!");
    } catch (error) {
      toast.error("Failed to shorten URL. Please enter a valid URL.");
      console.error(error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortenedUrl);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <header className="py-4 px-6 flex justify-between items-center bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gray-800 rounded-lg">
            <LinkIcon className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Shorty</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" className="hover:bg-gray-100">
            <Link to="/dashboard">My Links</Link>
          </Button>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
            Effortless URL Shortening
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            Create clean, memorable links. Perfect for sharing on social media, in emails, or anywhere you need a compact and elegant link.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-2xl"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder="Enter your long URL here"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="flex-1 text-lg py-6 px-4 border-2 border-gray-200 rounded-xl focus:border-gray-800 focus:ring-gray-800"
              />
              <Button 
                type="submit" 
                size="lg" 
                className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-6 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                Shorten
              </Button>
            </form>

            {shortenedUrl && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex items-center gap-3 p-4 bg-gray-100 border-2 border-gray-200 rounded-xl"
              >
                <a
                  href={shortenedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 font-medium truncate flex-1 hover:underline"
                >
                  {shortenedUrl}
                </a>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleCopy}
                  className="text-gray-600 hover:bg-gray-200 rounded-lg"
                >
                  <Copy className="h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
      <footer className="text-center p-6 text-sm text-gray-500">
        © {new Date().getFullYear()} Shorty. All Rights Reserved.
      </footer>
    </div>
  );
}