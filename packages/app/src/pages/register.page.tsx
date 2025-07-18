import { RegisterForm } from "@/components/forms/register-form";
import AuthTopbar from "@/components/auth-topbar";

function RegisterPage() {
    return (
        <>
            <AuthTopbar />
            <div className='w-3/4 md:w-full mx-auto flex flex-col justify-center items-center content-center text-center min-h-[80vh]'>
                <h1 className="text-2xl font-bold">Create a BrainShift Account</h1>
                <RegisterForm />
            </div>
        </>
    )
}

export default RegisterPage;