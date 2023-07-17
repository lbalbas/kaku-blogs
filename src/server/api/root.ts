import { blogPostsRouter } from "~/server/api/routers/blogposts";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  blogs: blogPostsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
