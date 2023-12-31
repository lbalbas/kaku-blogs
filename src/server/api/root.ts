import { blogPostsRouter } from "~/server/api/routers/blogposts";
import { draftsRouter } from "~/server/api/routers/drafts";
import { commentsRouter } from "~/server/api/routers/comments";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  blogs: blogPostsRouter,
  drafts: draftsRouter,
  comments: commentsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
