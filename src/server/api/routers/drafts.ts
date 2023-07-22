import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const draftsRouter = createTRPCRouter({
  getOneById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const result = await ctx.prisma.draft.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if (result == null)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "This draft doesn't exist or is not yours.",
        });

      return result;
    }),
  getAllByCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.draft.findMany({
      where: { userId: ctx.session.user.id },
    });
    return result;
  }),
  create: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.draft.create({
      data: {
        title: "New Post",
        content: "",
        userId: ctx.session.user.id,
      },
    });
    return { status: 200, msg: "Success" };
  }),
  save: protectedProcedure
    .input(z.object({ id: z.string(), title: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const draft = await ctx.prisma.draft.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });

      if (!draft) {
        return { status: 403, msg: "Unauthorized" };
      }

      await ctx.prisma.draft.update({
        where: { id: input.id },
        data: {
          title: input.title,
          content: input.content,
        },
      });

      return { status: 200, msg: "Success" };
    }),
});
