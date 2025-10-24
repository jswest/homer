import prisma from '$lib/prisma.js';

export const load = async ({ locals }) => {
  const { session, user } = await locals.safeGetSession();

  // Fetch recent posts with user info
  const posts = await prisma.post.findMany({
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
    take: 50, // Show last 50 posts
  });

  return {
    session,
    user: locals.user,
    supabaseUser: user,
    posts,
  };
};
