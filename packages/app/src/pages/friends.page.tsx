import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { dataService } from "@/services/api-service";
import { Loader2 } from "lucide-react";

function FriendsPage() {
  const [loading, setLoading] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [isFetchingFeedbackStatus, setIsFetchingFeedbackStatus] = useState(true);

  const handleFeedback = async (answer: string) => {
    setLoading(true);
    try {
      await dataService.submitFeedback({
        rating: 5,
        message: `User feedback on Friends feature: ${answer}`,
        category: "Friends Feature Interest",
      });
      toast.success("Thank you for your feedback!");
      setFeedbackSent(true);
    } catch (error) {
      toast.error("Failed to send feedback.");
      console.error("Error sending feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchFeedbackStatus = async () => {
      try {
        const response = await dataService.getFriendsFeedbackStatus();
        setFeedbackSent(response.hasGivenFeedback);
      } catch (error) {
        console.error("Error fetching friends feedback status:", error);
        toast.error("Failed to load feedback status.");
      } finally {
        setIsFetchingFeedbackStatus(false);
      }
    };

    fetchFeedbackStatus();
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-2xl font-bold">Friends</h1>
      <p className="text-lg text-gray-600">This feature is coming soon!</p>

      {!feedbackSent && !isFetchingFeedbackStatus && (
        <div className="space-y-4">
          <p className="text-md">Are you interested in connecting with friends on BrainShift?</p>
          <div className="flex gap-4">
            {
              loading ? <Loader2 className='animate-spin' /> :
                <>
                  <Button onClick={() => handleFeedback("Yes")} disabled={loading}>
                    Yes
                  </Button>
                  <Button onClick={() => handleFeedback("No")} disabled={loading}>
                    No
                  </Button>
                </>
            }
          </div>
        </div>
      )}

      {feedbackSent && (
        <p className="text-md text-green-600">Your feedback has been recorded. We appreciate your input!</p>
      )}
    </div>
  );
}

export default FriendsPage;
