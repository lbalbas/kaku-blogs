import * as NextAuth from "next-auth";
import { authOptions } from "~/server/auth";

export default NextAuth.default(authOptions);
