import React from "react";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth()

  return (
    <div>
        <h1>Profile Page</h1>
        <p>{session?.user?.name}</p>
        <p>{session?.user?.email}</p>
    </div>
  )
}