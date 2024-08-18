import { SignIn } from "@clerk/clerk-react"

export default function SignInPage() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <SignIn path="/sign-in" />
        </div>
    );
}