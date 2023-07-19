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
  getMostRecent: publicProcedure.query(async ({ctx})=>{
    return ctx.prisma.blogPost.findMany({
      take: 10,
      orderBy: {
        publishedAt: 'desc',
      }
    })
  }),
  publish: protectedProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.blogPost.create({
        data: {
          title: input.title,
          content: input.content,
          userId: ctx.session.user.id,
        },
      });
      return { status: 200, msg: "Success" };
    }),
});
