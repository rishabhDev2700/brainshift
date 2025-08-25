import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { dataService } from "@/services/api-service";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const feedbackSchema = z.object({
  message: z.string().min(10, "Feedback message must be at least 10 characters.").max(500, "Feedback message cannot exceed 500 characters."),
  rating: z.number().min(1).max(5),
  category: z.string().optional(),
});


function FeedbackPage() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      message: "",
      rating: 3,
      category: "",
    },
  });


  const onSubmit = async (data: z.infer<typeof feedbackSchema>) => {
    setLoading(true);
    try {
      await dataService.submitFeedback(data); // already validated
      toast.success("Feedback submitted successfully!");
      reset();
    } catch (error) {
      toast.error("Failed to submit feedback.");
      console.error("Error submitting feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <Card className="w-full max-w-2xl mx-auto bg-white/10 dark:bg-black/10 backdrop-blur-lg border border-emerald-600/20 rounded-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Submit Feedback</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">We appreciate your thoughts and suggestions!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label className="font-semibold text-gray-700 dark:text-gray-300" htmlFor="category">Category (optional)</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full mt-2 bg-transparent border-gray-300 dark:border-gray-700 focus:ring-emerald-500 focus:border-emerald-500">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/80 dark:bg-black/80 backdrop-blur-lg border-emerald-600/20">
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="bug_report">Bug Report</SelectItem>
                      <SelectItem value="feature_request">Feature Request</SelectItem>
                      <SelectItem value="general_feedback">General Feedback</SelectItem>
                      <SelectItem value="ui_ux_suggestion">UI/UX Suggestion</SelectItem>
                      <SelectItem value="performance_issue">Performance Issue</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <Label className="font-semibold text-gray-700 dark:text-gray-300" htmlFor="message">Your Feedback</Label>
              <Textarea
                id="message"
                placeholder="Tell us what you think..."
                {...register("message")}
                rows={5}
                className="mt-2 bg-transparent border-gray-300 dark:border-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
            </div>
            <div>
              <Label className="font-semibold text-gray-700 dark:text-gray-300" htmlFor="rating">Rating: {control._getWatch("rating")}</Label>
              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <Slider
                    id="rating"
                    min={1}
                    max={5}
                    step={1}
                    value={[field.value]}
                    onValueChange={(val) => field.onChange(val[0])}
                    className="w-full mt-2 [&>span:first-child]:bg-emerald-600"
                  />
                )}
              />
              {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>}
            </div>

            <Button type="submit" className="w-full bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-all duration-300" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Submit Feedback"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default FeedbackPage;
