import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AuthSignIn from "@/components/auth/auth.signin";
import { redirect } from 'next/navigation'

import { getServerSession } from "next-auth";

const SignInPage = async () => {
    const session = await getServerSession(authOptions);
    if (session) {
        // derirect to home page
        redirect('/')

    }
    return (
        <AuthSignIn />
    )
}

export default SignInPage;