import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";

function SubscriptionPage() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Free Plan */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl">Free</CardTitle>
            <CardDescription>Get started with essential features.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-4xl font-bold mb-4">$0<span className="text-lg font-normal">/month</span></p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center"><CheckIcon className="mr-2 h-4 w-4 text-green-500" />Basic task management</li>
              <li className="flex items-center"><CheckIcon className="mr-2 h-4 w-4 text-green-500" />Session tracking</li>
              <li className="flex items-center"><CheckIcon className="mr-2 h-4 w-4 text-green-500" />Goal setting</li>
              <li className="flex items-center"><CheckIcon className="mr-2 h-4 w-4 text-green-500" />Basic analytics</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" disabled>Current Plan</Button>
          </CardFooter>
        </Card>

        {/* Pro Monthly Plan */}
        <Card className="flex flex-col border-2 border-primary shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Pro Monthly</CardTitle>
            <CardDescription>Unlock advanced features for productivity.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-4xl font-bold mb-4">$6<span className="text-lg font-normal">/month</span></p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center"><CheckIcon className="mr-2 h-4 w-4 text-green-500" />Everything in Free</li>
              <li className="flex items-center"><CheckIcon className="mr-2 h-4 w-4 text-green-500" />Monthly analytics reports</li>
              <li className="flex items-center"><CheckIcon className="mr-2 h-4 w-4 text-green-500" />Priority support</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Choose Plan</Button>
          </CardFooter>
        </Card>

        {/* Pro Yearly Plan */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl">Pro Yearly</CardTitle>
            <CardDescription>Save more with an annual subscription.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-4xl font-bold mb-4">$54<span className="text-lg font-normal">/year</span></p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center"><CheckIcon className="mr-2 h-4 w-4 text-green-500" />Everything in Pro Monthly</li>
              <li className="flex items-center"><CheckIcon className="mr-2 h-4 w-4 text-green-500" />Annual analytics reports</li>
              <li className="flex items-center"><CheckIcon className="mr-2 h-4 w-4 text-green-500" />Extended data retention</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline">Choose Plan</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default SubscriptionPage;
