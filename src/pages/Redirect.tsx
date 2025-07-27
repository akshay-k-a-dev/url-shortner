import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Loader2 } from "lucide-react";

export default function Redirect() {
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      try {
        const storedUrls = JSON.parse(localStorage.getItem("shorty-urls") || "[]");
        const urlData = storedUrls.find((u: any) => u.slug === slug);

        if (urlData && urlData.original) {
          // Increment click count
          const updatedUrls = storedUrls.map((u: any) => 
            u.slug === slug ? { ...u, clicks: u.clicks + 1 } : u
          );
          localStorage.setItem("shorty-urls", JSON.stringify(updatedUrls));
          
          // Redirect to the original URL
          window.location.replace(urlData.original);
        } else {
          // If URL not found, redirect to home page
          navigate("/");
        }
      } catch (error) {
        console.error("Failed to parse URLs from localStorage", error);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [slug, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <Loader2 className="h-12 w-12 animate-spin mb-4" />
      <p className="text-lg text-muted-foreground">Redirecting...</p>
    </div>
  );
}