import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";

export default function Redirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // Since we are using is.gd, we don't need a custom redirect page.
    // is.gd handles the redirect for us.
    // This page is now just a fallback.
    navigate("/");
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <Loader2 className="h-12 w-12 animate-spin mb-4" />
      <p className="text-lg text-muted-foreground">Redirecting...</p>
    </div>
  );
}