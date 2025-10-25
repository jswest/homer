import prisma from '$lib/prisma.js';
import { error, redirect, fail } from '@sveltejs/kit';

export const load = async ({ params, locals, url }) => {
  const { session } = await locals.safeGetSession();

  if (!session) {
    redirect(303, '/');
  }

  // Find the user by handle
  const user = await prisma.user.findUnique({
    where: {
      handle: params.handle,
    },
  });

  if (!user) {
    error(404, 'User not found');
  }

  // Pagination
  const page = parseInt(url.searchParams.get('page') || '1');
  const perPage = 100;
  const offset = (page - 1) * perPage;

  // Get total count
  const totalPosts = await prisma.post.count({
    where: {
      userId: user.id,
      parentId: null,
    },
  });

  const totalPages = Math.ceil(totalPosts / perPage);

  // Fetch posts from this user (only top-level posts, not replies)
  const posts = await prisma.post.findMany({
    where: {
      userId: user.id,
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

  // Check if current user follows this user
  let isFollowing = false;
  if (locals.user && locals.user.id !== user.id) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: locals.user.id,
          followingId: user.id,
        },
      },
    });
    isFollowing = !!follow;
  }

  // Get follower/following counts
  const followerCount = await prisma.follow.count({
    where: {
      followingId: user.id,
    },
  });

  const followingCount = await prisma.follow.count({
    where: {
      followerId: user.id,
    },
  });

  return {
    session,
    currentUser: locals.user,
    profileUser: user,
    posts,
    isFollowing,
    followerCount,
    followingCount,
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

  follow: async ({ params, locals }) => {
    const { session } = await locals.safeGetSession();

    if (!session || !locals.user) {
      return fail(401, { error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { handle: params.handle },
    });

    if (!user) {
      return fail(404, { error: 'User not found' });
    }

    // Can't follow yourself
    if (user.id === locals.user.id) {
      return fail(400, { error: 'Cannot follow yourself' });
    }

    try {
      await prisma.follow.create({
        data: {
          followerId: locals.user.id,
          followingId: user.id,
        },
      });
    } catch (error) {
      // Already following
      return fail(400, { error: 'Already following' });
    }

    return { success: true };
  },

  unfollow: async ({ params, locals }) => {
    const { session } = await locals.safeGetSession();

    if (!session || !locals.user) {
      return fail(401, { error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { handle: params.handle },
    });

    if (!user) {
      return fail(404, { error: 'User not found' });
    }

    try {
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: locals.user.id,
            followingId: user.id,
          },
        },
      });
    } catch (error) {
      return fail(400, { error: 'Not following' });
    }

    return { success: true };
  },
};
