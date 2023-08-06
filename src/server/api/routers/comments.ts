import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";

export const commentsRouter = createTRPCRouter({
	getCommentsByPost: publicProcedure.input(z.object({post: z.string()})).query(async({ctx, input})=>{
		const comments = ctx.prisma.comment.findMany({
			where: {
				blogPostId: input.post,
			},
			include: {
				user: true,
				parentComment: true,
				childComments: true,
			}
		})

		return comments;
	}),
	makeComment: protectedProcedure.input(z.object({post: z.string(), content: z.string().min(1)})).mutation(async({ctx, input}) =>{
		return await ctx.prisma.comment.create({
			data: {
				content: input.content,
				blogPostId: input.post,
				userId: ctx.session.user.id,
			}
		})
	})
})