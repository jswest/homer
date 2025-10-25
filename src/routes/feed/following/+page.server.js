import prisma from '$lib/prisma.js';
import { redirect, fail } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
  const { session } = await locals.safeGetSession();

  if (!session) {
    redirect(303, '/');
  }

  if (!locals.user) {
    redirect(303, '/profile');
  }

  // Get IDs of users the current user follows
  const following = await prisma.follow.findMany({
    where: {
      followerId: locals.user.id,
    },
    select: {
      followingId: true,
    },
  });

  const followingIds = following.map((f) => f.followingId);

  // Pagination
  const page = parseInt(url.searchParams.get('page') || '1');
  const perPage = 100;
  const offset = (page - 1) * perPage;

  // Get total count
  const totalPosts = await prisma.post.count({
    where: {
      userId: {
        in: followingIds,
      },
      parentId: null,
    },
  });

  const totalPages = Math.ceil(totalPosts / perPage);

  // Fetch posts from followed users (only top-level posts, not replies)
  const posts = await prisma.post.findMany({
    where: {
      userId: {
        in: followingIds,
      },
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
    skip: offset,
    take: perPage,
  });

  return {
    session,
    user: locals.user,
    posts,
    followingCount: followingIds.length,
    pagination: {
      page,
      totalPages,
      totalPosts,
      perPage,
    },
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
