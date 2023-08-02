import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const blogPostsRouter = createTRPCRouter({
  getOneById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const result = await ctx.prisma.blogPost.findFirst({
        where: { id: input.id },
        include: {
          user: true,
        },
      });

      return result;
    }),
  getMostRecent: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.blogPost.findMany({
      take: 9,
      orderBy: {
        publishedAt: "desc",
      },
      include: {
        user: true,
      },
    });
  }),
  getAllByUserId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: input.id,
        },
      });

      if (!user) throw new Error("User doesn't exist");

      const posts = await ctx.prisma.blogPost.findMany({
        where: {
          userId: input.id,
        },
        orderBy: {
          publishedAt: "desc",
        },
      });
      const userWithPosts = {
        posts,
        user,
      };
      return userWithPosts;
    }),
  publish: protectedProcedure
    .input(
      z.object({ draftId: z.string(), title: z.string(), content: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.$transaction([
        ctx.prisma.blogPost.create({
          data: {
            title: input.title,
            content: input.content,
            userId: ctx.session.user.id,
          },
        }),
        ctx.prisma.draft.delete({ where: { id: input.draftId } }),
      ]);
    }),
  search: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.blogPost.findMany({
        where: {
          title: {
            search: input.query,
          },
          content: {
            search: input.query,
          },
        },
        orderBy: {
          _relevance: {
            fields: ["title"],
            search: input.query,
            sort: "asc",
          },
        },
        include: {
          user: true,
        },
      });
    }),
});
