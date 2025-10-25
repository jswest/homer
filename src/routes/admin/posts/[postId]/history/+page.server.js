import { error } from '@sveltejs/kit';
import prisma from '$lib/prisma.js';

export const load = async ({ params }) => {
  // Fetch the post
  const post = await prisma.post.findUnique({
    where: {
      id: params.postId,
    },
    include: {
      user: {
        select: {
          handle: true,
          biography: true,
        },
      },
    },
  });

  if (!post) {
    error(404, 'Post not found');
  }

  // Fetch all body history for this post
  const bodyHistory = await prisma.postBody.findMany({
    where: {
      postId: params.postId,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return {
    post,
    bodyHistory,
  };
};
