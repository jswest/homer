import prisma from '$lib/prisma.js';
import { error, redirect, fail } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
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

  // Fetch posts from this user
  const posts = await prisma.post.findMany({
    where: {
      userId: user.id,
    },
    include: {
      user: {
        select: {
          handle: true,
          biography: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
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
  };
};

export const actions = {
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
