// import { createAuthClient } from "better-auth/react"
// export const authClient = createAuthClient({})

import { createAuthClient } from "better-auth/react"
import { emailOTPClient } from "better-auth/client/plugins"
 
export const authClient = createAuthClient({
    plugins: [
        emailOTPClient()
    ]
})