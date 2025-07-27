// TODO: THIS IS THE DEFAULT DASHBOARD PAGE THAT THE USER WILL SEE AFTER AUTHENTICATION. ADD MAIN FUNCTIONALITY HERE.
// This is the entry point for users who have just signed in

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Link as LinkIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [urls, setUrls] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedUrls = JSON.parse(localStorage.getItem("shorty-urls") || "[]");
      
      if (!Array.isArray(storedUrls)) {
        throw new Error("Invalid data format in storage");
      }
      
      setUrls(storedUrls.sort((a: any, b: any) => b._creationTime - a._creationTime));
      setError(null);
    } catch (storageError) {
      console.error("Failed to load URLs from storage:", storageError);
      setError("Failed to load your URLs. Storage may be corrupted.");
      setUrls([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCopy = async (shortUrl: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success("Copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
      
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = shortUrl;
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

  const handleClearHistory = () => {
    try {
      localStorage.removeItem("shorty-urls");
      localStorage.removeItem("shorty-redirects");
      setUrls([]);
      toast.success("History cleared successfully!");
    } catch (error) {
      console.error("Failed to clear history:", error);
      toast.error("Failed to clear history.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <header className="py-4 px-6 flex justify-between items-center bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-blue-500 rounded-lg">
              <LinkIcon className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-800">Shorty Dashboard</h1>
          </Link>
        </header>
        
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading your links...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <header className="py-4 px-6 flex justify-between items-center bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-blue-500 rounded-lg">
              <LinkIcon className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-800">Shorty Dashboard</h1>
          </Link>
        </header>
        
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="h-12 w-12 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Links</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <div className="space-y-2">
              <Button onClick={() => window.location.reload()} className="bg-blue-500 hover:bg-blue-600">
                Try Again
              </Button>
              <Button variant="outline" onClick={handleClearHistory}>
                Clear All Data
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="py-4 px-6 flex justify-between items-center bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <Link to="/" className="flex items-center gap-2">
          <div className="p-2 bg-blue-500 rounded-lg">
            <LinkIcon className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-800">Shorty Dashboard</h1>
        </Link>
      </header>
      
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white shadow-lg">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-2xl text-gray-800">Your Links</CardTitle>
                <CardDescription className="text-gray-500">
                  Manage and track all your shortened links
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {urls?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-200 hover:bg-transparent">
                          <TableHead className="font-semibold text-gray-600">Original URL</TableHead>
                          <TableHead className="font-semibold text-gray-600">Short URL</TableHead>
                          <TableHead className="font-semibold text-gray-600">Created</TableHead>
                          <TableHead className="text-right font-semibold text-gray-600">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {urls.map((url) => (
                          <TableRow key={url._id} className="border-gray-100 hover:bg-gray-50">
                            <TableCell className="truncate max-w-xs">
                              <a
                                href={url.original}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-700 hover:underline font-medium"
                              >
                                {url.original}
                              </a>
                            </TableCell>
                            <TableCell>
                              <a
                                href={url.shortUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline font-medium"
                              >
                                {url.shortUrl}
                              </a>
                            </TableCell>
                            <TableCell className="text-gray-500">
                              {formatDistanceToNow(new Date(url._creationTime), {
                                addSuffix: true,
                              })}
                            </TableCell>
                            <TableCell className="flex gap-2 justify-end">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleCopy(url.shortUrl)}
                                className="text-gray-500 hover:bg-gray-200"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <a
                                href={url.shortUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-200">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </a>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <LinkIcon className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No URLs yet</h3>
                    <p className="text-gray-500 mb-6">You haven't shortened any URLs yet. Create your first one!</p>
                    <Button asChild className="bg-blue-500 hover:bg-blue-600">
                      <Link to="/">Create Short URL</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}