import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useProfile, useUpdateProfile } from '../hooks/useProfile';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
const profileFormSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

function ProfilePage() {
  const { userId } = useParams<{ userId?: string }>();
  const isViewingOtherUser = !!userId;
  const { data: profile, isLoading, isError, error } = useProfile(userId ? parseInt(userId) : undefined);
  const updateProfileMutation = useUpdateProfile();

  const { register, handleSubmit, reset, formState: { errors }, getValues } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
  });

  useEffect(() => {
    if (profile && !isLoading) {
      const currentFullName = getValues().fullName;
      const currentEmail = getValues().email;

      if (currentFullName !== profile.fullName || currentEmail !== profile.email) {
        reset(profile);
      }
    }
  }, [profile, isLoading, reset, getValues]);

  const onSubmit = async (data: ProfileFormData) => {
    updateProfileMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Profile updated successfully!');
      },
      onError: (err) => {
        console.error('Error updating profile:', err);
        toast.error('Failed to update profile.');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:px-8">
        <Skeleton className="h-10 w-1/3 mb-6" />
        <Separator className="mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="max-w-lg space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">{isViewingOtherUser ? `${profile?.fullName}'s Profile` : "Your Profile"}</h2>
      <Separator className="mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 text-center">
          <h3 className="text-lg font-semibold">Goals Completed</h3>
          <p className="text-2xl font-bold text-emerald-600">{profile?.goalsCompleted || 0}</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-lg font-semibold">Tasks Completed</h3>
          <p className="text-2xl font-bold text-emerald-600">{profile?.tasksCompleted || 0}</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-lg font-semibold">Time Spent (minutes)</h3>
          <p className="text-2xl font-bold text-emerald-600">{profile?.timeSpent || 0}</p>
        </Card>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-6">
        <div>
          <Label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</Label>
          <Input id="fullName" type="text" {...register('fullName')} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" readOnly={isViewingOtherUser} />
          {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
        </div>
        <div>
          <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</Label>
          <Input id="email" type="email" {...register('email')} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" readOnly={isViewingOtherUser} />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        {!isViewingOtherUser && (
          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">Save Changes</Button>
        )}
      </form>
    </div>
  );
}

export default ProfilePage;
