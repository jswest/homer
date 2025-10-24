import prisma from '$lib/prisma.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
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

  // Fetch posts from followed users
  const posts = await prisma.post.findMany({
    where: {
      userId: {
        in: followingIds,
      },
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

  return {
    session,
    user: locals.user,
    posts,
    followingCount: followingIds.length,
  };
};
