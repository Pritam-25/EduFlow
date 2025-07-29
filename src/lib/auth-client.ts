import { createAuthClient } from "better-auth/react";
import { emailOTPClient, inferAdditionalFields } from "better-auth/client/plugins";
import { Role } from "@/generated/prisma";

export const authClient = createAuthClient({
  plugins: [emailOTPClient(), inferAdditionalFields({
    user: {
      role: {
        type: [Role.USER, Role.ADMIN],
        defaultValue: Role.USER,// default role is USER
        input: true, // allow user to set role - false with hide this field,
        returned: true, // return this field in the user object
      },
    },
  })]
});