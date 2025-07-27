import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Loader2 } from "lucide-react";

export default function Redirect() {
  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    if (slug) {
      // Check if we have a local redirect stored
      const redirects = JSON.parse(localStorage.getItem("shorty-redirects") || "{}");
      const targetUrl = redirects[slug];
      
      if (targetUrl) {
        // Add a small delay to show the loading state
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 500);
        return;
      }
    }
    
    // If no local redirect found, go to home after a delay
    setTimeout(() => {
      navigate("/");
    }, 1000);
  }, [navigate, slug]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <Loader2 className="h-12 w-12 animate-spin mb-4" />
      <p className="text-lg text-muted-foreground">
        {localStorage.getItem("shorty-redirects") && JSON.parse(localStorage.getItem("shorty-redirects") || "{}")[slug || ""] 
          ? "Redirecting..." 
          : "Link not found, redirecting to home..."}
      </p>
    </div>
  );
}