import AuthTopbar from "@/components/auth-topbar";
import { LoginForm } from "@/components/forms/login-form";
import bg from "@/assets/login.jpg"
function LoginPage() {
    return (
        <>
            <AuthTopbar />
            <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
                <div className="hidden md:block bg-emerald-600">
                    <img src={bg} alt="Login Image" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center items-center p-8 md:bg-transparent bg-white/10 dark:bg-black/10 backdrop-blur-lg border border-emerald-600/20 rounded-lg mx-4 md:m-0 md:border-none md:rounded-none">
                    <div className="w-full max-w-lg">
                        <h1 className="text-3xl font-bold mb-4 text-center">Login to BrainShift</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">Welcome back! Please login to your account.</p>
                        <LoginForm />
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginPage