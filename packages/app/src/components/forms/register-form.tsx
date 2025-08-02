import { Input } from "@/components/ui/input"
import { Link, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authService } from "@/services/api-service";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

const registerSchema = z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

export function RegisterForm() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema)
    });
    const { login } = useAuth()

    const onSubmit = async (data: any) => {
        try {
            const res = await authService.register(data);
            if (res) {
                login(res?.data.token)
                toast.success("Logged in Successfully", { description: "Welcome" })
                navigate('/dashboard');
            }

            console.log(res)

        } catch (err) {
            toast.success("Something went wrong", { description: "Please try again" })

            console.error(err)
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
            <Button type="submit" className="w-full rounded-full bg-emerald-600 hover:bg-emerald-800">Register</Button>
            <Link className="text-gray-600 text-sm mt-4 block" to="/"><Button variant="secondary" className="w-full bg-neutral-100 dark:text-neutral-800 hover:bg-neutral-200 border border-neutral-200/40 rounded-full">Login</Button></Link>
            <Link className="text-gray-600 text-sm mt-4 block hover:underline" to="/forgot-password">Forgot Password?</Link>
        </form>
    )
}
