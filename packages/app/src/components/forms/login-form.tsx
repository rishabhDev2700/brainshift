import { Input } from "@/components/ui/input"
import { Link, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { authService } from "@/services/api-service"
import { toast } from "sonner"
import { Separator } from "../ui/separator"
import { GoogleLogin } from '@react-oauth/google';
import { useState } from "react";
import { Loader2 } from "lucide-react";
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export function LoginForm() {
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const response = await authService.login(data);
            if (response?.data.token) {
                login(response?.data.token);
                toast.success("Logged in Successfully", { description: "Welcome" })
                navigate('/dashboard');
            }

        } catch (err) {
            toast.success("Something went wrong", { description: "Please try again" })
            console.error(err)
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form className="w-full md:w-1/3" onSubmit={handleSubmit(onSubmit)}>
                <Input className="my-4 py-2 px-4 rounded-full" aria-label="email" type='email' placeholder='Username or Email' {...register("email")} />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message as string}</p>}
                <Input className="my-4 py-2 px-4 rounded-full" aria-label="password" type='password' placeholder='Password' {...register("password")} />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message as string}</p>}
                <Button type="submit" className="w-full rounded-full bg-emerald-600 hover:bg-emerald-800" disabled={loading}>{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login"}</Button>
                <Link className="text-gray-600 text-sm mt-4 block" to="/register"><Button variant="secondary" className="w-full bg-neutral-100 dark:text-neutral-800 hover:bg-neutral-200 border border-neutral-200/40 rounded-full">Register</Button></Link>
                <Link className="text-gray-600 text-sm mt-4 block hover:underline" to="/forgot-password">Forgot Password?</Link>
            </form>
            <Separator className="mb-4" />
            <GoogleLogin
                onSuccess={async credentialResponse => {
                    if (credentialResponse.credential) {
                        setLoading(true);
                        try {
                            const response = await authService.googleLogin(credentialResponse.credential);
                            if (response?.data.token) {
                                login(response?.data.token);
                                toast.success("Logged in Successfully", { description: "Welcome" })
                                navigate('/dashboard');
                            }
                        } catch (err) {
                            toast.error("Google login failed", { description: "Please try again" })
                            console.error(err)
                        } finally {
                            setLoading(false);
                        }
                    }
                }}
                onError={() => {
                    console.log('Login Failed');
                    toast.error("Google login failed", { description: "Please try again" })
                }}
                useOneTap
                auto_select
            />
        </>
    )
}
