import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const commentsRouter = createTRPCRouter({
  getCommentsByPost: publicProcedure
    .input(z.object({ post: z.string() }))
    .query(async ({ ctx, input }) => {
      const comments = await ctx.prisma.comment.findMany({
        where: {
          blogPostId: input.post,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      return commentsToTree(comments);
    }),
  makeComment: protectedProcedure
    .input(z.object({ post: z.string(), content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.comment.create({
        data: {
          content: input.content,
          blogPostId: input.post,
          userId: ctx.session.user.id,
        },
      });
    }),
});

interface Comment {
  id: string;
  content: string;
  userId: string;
  blogPostId: string;
  parentCommentId: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
  };
  childComments?: Comment[];
}

function commentsToTree(comments: Comment[]) {
  let commentMap: { [key: string]: Comment } = {};

  // make a map for fast lookup
  comments.forEach((comment) => {
    comment.childComments = []; // add children placeholder
    commentMap[comment.id] = comment;
  });

  // connect child comments to their parent and gather root comments
  let roots: Comment[] = [];
  comments.forEach((comment) => {
    if (!comment.parentCommentId) {
      // is a root comment
      roots.push(comment);
    } else {
      // it is guaranteed to exist
      commentMap[comment.parentCommentId]!.childComments?.push(comment);
    }
  });

  return roots;
}
