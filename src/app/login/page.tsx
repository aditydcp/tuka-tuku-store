import React from "react";
import { Button } from "@/components/ui/button";
import { signIn, providerMap } from "@/auth";

export default function Page() {
    return (
        <div className="flex flex-col space-y-3 m-4">
            <h1>Login</h1>
            {Object.values(providerMap).map((provider) => (
                <form
                    key={provider.id}
                    action={async () => {
                        "use server"
                        await signIn(provider.id)
                    }}
                >
                    <Button type="submit">
                        Sign In with {provider.name}
                    </Button>
                </form>
            ))}
        </div>
    )
}