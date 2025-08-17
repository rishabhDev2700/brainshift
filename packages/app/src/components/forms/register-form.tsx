import { Input } from "@/components/ui/input"
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authService } from "@/services/api-service";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const registerSchema = z.object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export function RegisterForm() {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema)
    });
    const onSubmit = async (data: z.infer<typeof registerSchema>) => {
        setLoading(true);
        try {
            const { fullName, email, password } = data;
            const res = await authService.register({ fullName, email, password });
            if (res) {
                toast.success("Registration successful", { description: "Please check your email for verification." });
            }

            console.log(res)

        } catch (err) {
            toast.success("Something went wrong", { description: "Please try again" })

            console.error(err)
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="w-full md:w-1/3" onSubmit={handleSubmit(onSubmit)}>
            <Input className="my-4 py-2 px-4 rounded-full" aria-label="full name" type='text' placeholder='Full Name' {...register("fullName")} />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message as string}</p>}
            <Input className="my-4 py-2 px-4 rounded-full" aria-label="email" type='email' placeholder='Your Email' {...register("email")} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message as string}</p>}
            <Input className="my-4 py-2 px-4 rounded-full" aria-label="password" type='password' placeholder='Password' {...register("password")} />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message as string}</p>}
            <Input className="my-4 py-2 px-4 rounded-full" aria-label="confirm password" type='password' placeholder='Confirm Password' {...register("confirmPassword")} />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message as string}</p>}
            <Button type="submit" className="w-full rounded-full bg-emerald-600 hover:bg-emerald-800" disabled={loading}>{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Register"}</Button>
            <Link className="text-gray-600 text-sm mt-4 block" to="/"><Button variant="secondary" className="w-full bg-neutral-100 dark:text-neutral-800 hover:bg-neutral-200 border border-neutral-200/40 rounded-full">Login</Button></Link>
            <Link className="text-gray-600 text-sm mt-4 block hover:underline" to="/forgot-password">Forgot Password?</Link>
        </form>
    )
}
