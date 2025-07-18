import AuthTopbar from "@/components/auth-topbar";
import { LoginForm } from "@/components/forms/login-form";
import { Separator } from "@/components/ui/separator";

function LoginPage() {
    return (
        <>
            <AuthTopbar />
            <div className='w-3/4 md:w-full mx-auto flex flex-col justify-center items-center content-center text-center min-h-[80vh]'>
                <h2 className="text-lg">Welcome</h2>
                <div className="mx-auto w-52">
                    <Separator className="my-4" />
                </div>
                <h1 className="text-2xl font-bold">Login to BrainShift</h1>
                <LoginForm />
            </div>
        </>
    )
}

export default LoginPage

