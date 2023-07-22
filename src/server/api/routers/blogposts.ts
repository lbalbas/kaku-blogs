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
      });

      return result;
    }),
  getMostRecent: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.blogPost.findMany({
      take: 10,
      orderBy: {
        publishedAt: "desc",
      },
      include: {
        user: true,
      },
    });
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
});
