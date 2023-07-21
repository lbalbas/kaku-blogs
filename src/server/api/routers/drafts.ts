import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const draftsRouter = createTRPCRouter({
  getOneById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const result = await ctx.prisma.draft.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if(result == null) throw new TRPCError({ code: "Drafts doesn't exist or doesn't belong to user." });  
      
      return result;
    }),
  getAllByUser: protectedProcedure.query(async ({ ctx }) => {
      const result = await ctx.prisma.draft.findMany({
        where: { userId: ctx.session.user.id },
      });
      return result;
    }),
  save: protectedProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.draft.create({
        data: {
          title: input.title,
          content: input.content,
          userId: ctx.session.user.id,
        },
      });
      return { status: 200, msg: "Success" };
    }),
});
