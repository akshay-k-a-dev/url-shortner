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
import { Copy, ExternalLink, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [urls, setUrls] = useState<any[]>([]);

  useEffect(() => {
    const storedUrls = JSON.parse(localStorage.getItem("shorty-urls") || "[]");
    setUrls(storedUrls.sort((a: any, b: any) => b._creationTime - a._creationTime));
  }, []);

  const handleCopy = (slug: string) => {
    const url = `${window.location.origin}/s/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <header className="py-4 px-6 flex justify-between items-center bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <Link to="/" className="flex items-center gap-2">
          <div className="p-2 bg-gray-800 rounded-lg">
            <LinkIcon className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Shorty Dashboard</h1>
        </Link>
      </header>
      
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-2xl text-gray-900">Your Links</CardTitle>
                <CardDescription className="text-gray-600">
                  Manage and track all your shortened links
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {urls?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-200 hover:bg-transparent">
                          <TableHead className="font-semibold text-gray-700">Original URL</TableHead>
                          <TableHead className="font-semibold text-gray-700">Short URL</TableHead>
                          <TableHead className="font-semibold text-gray-700">Clicks</TableHead>
                          <TableHead className="font-semibold text-gray-700">Created</TableHead>
                          <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
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
                                className="text-gray-800 hover:underline font-medium"
                              >
                                {url.original}
                              </a>
                            </TableCell>
                            <TableCell>
                              <a
                                href={`${window.location.origin}/s/${url.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline font-medium"
                              >
                                {`${window.location.host}/s/${url.slug}`}
                              </a>
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {url.clicks}
                              </span>
                            </TableCell>
                            <TableCell className="text-gray-600">
                              {formatDistanceToNow(new Date(url._creationTime), {
                                addSuffix: true,
                              })}
                            </TableCell>
                            <TableCell className="flex gap-2 justify-end">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleCopy(url.slug)}
                                className="text-gray-600 hover:bg-gray-200"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <a
                                href={`${window.location.origin}/s/${url.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-200">
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
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No URLs yet</h3>
                    <p className="text-gray-600 mb-6">You haven't shortened any URLs yet. Create your first one!</p>
                    <Button asChild className="bg-gray-800 hover:bg-gray-900">
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