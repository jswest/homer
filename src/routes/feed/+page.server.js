import prisma from '$lib/prisma.js';
import { fail } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  const { session, user } = await locals.safeGetSession();

  // Fetch recent posts with user info (only top-level posts, not replies)
  const posts = await prisma.post.findMany({
    where: {
      parentId: null, // Only top-level posts
    },
    include: {
      user: {
        select: {
          handle: true,
          biography: true,
        },
      },
      replies: {
        include: {
          user: {
            select: {
              handle: true,
              biography: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50, // Show last 50 posts
  });

  return {
    session,
    user: locals.user,
    supabaseUser: user,
    posts,
  };
};

export const actions = {
  deletePost: async ({ request, locals }) => {
    if (!locals.user?.isAdmin) {
      return fail(403, { error: 'Unauthorized' });
    }

    const formData = await request.formData();
    const postId = formData.get('postId');

    if (!postId) {
      return fail(400, { error: 'Post ID is required' });
    }

    try {
      await prisma.post.delete({
        where: { id: postId },
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      return fail(500, { error: 'Failed to delete post' });
    }

    return { success: true, message: 'Post deleted successfully' };
  },
};
