import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Loader2 } from "lucide-react";

export default function Redirect() {
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      const storedUrls = JSON.parse(localStorage.getItem("shorty-urls") || "[]");
      const urlData = storedUrls.find((u: any) => u.slug === slug);

      if (urlData) {
        urlData.clicks += 1;
        localStorage.setItem("shorty-urls", JSON.stringify(storedUrls));
        window.location.href = urlData.original;
      } else {
        navigate("/not-found");
      }
    }
  }, [slug, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <Loader2 className="h-12 w-12 animate-spin mb-4" />
      <p className="text-lg text-muted-foreground">Redirecting...</p>
    </div>
  );
}
