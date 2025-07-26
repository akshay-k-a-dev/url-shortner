// TODO: THIS IS THE DEFAULT DASHBOARD PAGE THAT THE USER WILL SEE AFTER AUTHENTICATION. ADD MAIN FUNCTIONALITY HERE.
// This is the entry point for users who have just signed in

import { Protected } from "@/lib/protected-page";
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
import { UserButton } from "@/components/auth/UserButton";
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
    <Protected>
      <div className="flex flex-col min-h-screen bg-muted/40">
        <header className="py-4 px-6 flex justify-between items-center border-b bg-background">
          <Link to="/" className="flex items-center gap-2">
            <LinkIcon className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">Shorty Dashboard</h1>
          </Link>
          <UserButton />
        </header>
        <main className="flex-1 p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Your Shortened URLs</CardTitle>
                <CardDescription>
                  Here are all the URLs you have shortened.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Original URL</TableHead>
                      <TableHead>Short URL</TableHead>
                      <TableHead>Clicks</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {urls?.map((url) => (
                      <TableRow key={url._id}>
                        <TableCell className="truncate max-w-xs">
                          <a
                            href={url.original}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {url.original}
                          </a>
                        </TableCell>
                        <TableCell>
                          <a
                            href={`${window.location.origin}/s/${url.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {`${window.location.host}/s/${url.slug}`}
                          </a>
                        </TableCell>
                        <TableCell>{url.clicks}</TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(url._creationTime), {
                            addSuffix: true,
                          })}
                        </TableCell>
                        <TableCell className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopy(url.slug)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <a
                            href={`${window.location.origin}/s/${url.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="ghost" size="icon">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {urls?.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    You haven't shortened any URLs yet. Go ahead and create one!
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </Protected>
  );
}