import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your email...");
  const [hasVerified, setHasVerified] = useState(false);

  useEffect(() => {
    if (token && !hasVerified) {
      const verifyEmail = async () => {
        try {
          await axios.get(`${import.meta.env.VITE_API_DOMAIN}/auth/verify-email?token=${token}`);
          setHasVerified(true);
          setMessage("Email verified successfully! Please log in.");
          toast.success("Email verified successfully! Please log in.");
          navigate("/");
        } catch (error: any) {
          console.log(error);
          setMessage(error.response.data.error || "Failed to verify email.");
          toast.error(error.response.data.error || "Failed to verify email.");
        }
      };

      verifyEmail();
    }
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{message}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => navigate("/")} className="w-full">
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;