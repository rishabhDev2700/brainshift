import AuthTopbar from "@/components/auth-topbar";
import { RegisterForm } from "@/components/forms/register-form";
import bg from "@/assets/register.jpg"
function RegisterPage() {
    return (
        <>
            <AuthTopbar />
            <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
                <div className="hidden md:block bg-emerald-600">
                    <img src={bg} alt="Register Image" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center items-center p-8 md:bg-transparent bg-white/10 dark:bg-black/10 backdrop-blur-lg border border-emerald-600/20 rounded-lg mx-4 md:m-0 md:border-none md:rounded-none">
                    <div className="w-full max-w-lg">
                        <h1 className="text-3xl font-bold mb-4 text-center">Create your BrainShift account</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">Join us and start managing your tasks, goals, and events efficiently!</p>
                        <RegisterForm />
                    </div>
                </div>
            </div>
        </>
    )
}

export default RegisterPage
