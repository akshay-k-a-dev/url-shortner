// TODO: THIS IS THE LANDING PAGE THAT THE USER WILL ALWAYS FIRST SEE. make sure to update this page
// Make sure that the marketing text always reflects the app marketing. create an aesthetic properly-designed landing page that fits the theme of the app
// start completely from scratch to make this landing page using aesthetic design principles and tailwind styling to create a unique and thematic landing page.

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Link as LinkIcon, Copy } from "lucide-react";
import { AuthButton } from "@/components/auth/AuthButton";
import { UserButton } from "@/components/auth/UserButton";
import { useAuth } from "@/hooks/use-auth";

export default function Landing() {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const createUrl = useMutation(api.urls.createUrl);
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const slug = await createUrl({ url });
      const newUrl = `${window.location.origin}/s/${slug}`;
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
    <div className="flex flex-col min-h-screen bg-background">
      <header className="py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <LinkIcon className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">Shorty</h1>
        </div>
        <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground hidden md:block">
                {isAuthenticated ? "Welcome back!" : "Login to see your links"}
            </p>
            {isAuthenticated ? <UserButton /> : <AuthButton />}
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            The Easiest URL Shortener.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Create short, memorable links in seconds. Perfect for sharing on social media, in emails, or anywhere you need a compact link.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-lg"
        >
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="url"
              placeholder="https://your-long-url.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="flex-1 text-base py-6"
            />
            <Button type="submit" size="lg">Shorten</Button>
          </form>

          {shortenedUrl && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center gap-2 p-2 border rounded-md bg-muted/50"
            >
              <a
                href={shortenedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium truncate"
              >
                {shortenedUrl}
              </a>
              <Button variant="ghost" size="icon" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        Built with <a href="https://vly.ai" target="_blank" rel="noopener noreferrer" className="underline">vly.ai</a>
      </footer>
    </div>
  );
}