import { fail, redirect, error } from '@sveltejs/kit';
import prisma from '$lib/prisma.js';

export const load = async ({ params, locals }) => {
  const { session } = await locals.safeGetSession();

  if (!session) {
    redirect(303, '/');
  }

  if (!locals.user) {
    redirect(303, '/profile');
  }

  // Fetch the parent post
  const parentPost = await prisma.post.findUnique({
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

  if (!parentPost) {
    error(404, 'Post not found');
  }

  // Can't reply to a reply (only one level deep)
  if (parentPost.parentId) {
    error(400, 'Cannot reply to a reply. You can only reply to top-level posts.');
  }

  return {
    user: locals.user,
    parentPost,
  };
};

export const actions = {
  default: async ({ request, params, locals }) => {
    const { session } = await locals.safeGetSession();

    if (!session) {
      redirect(303, '/');
    }

    if (!locals.user) {
      return fail(400, {
        error: 'Please complete your profile first',
      });
    }

    const formData = await request.formData();
    const body = formData.get('body');

    // Validate post body
    if (!body || body.length === 0) {
      return fail(400, {
        error: 'Reply body is required',
        body,
      });
    }

    if (body.length > 500) {
      return fail(400, {
        error: 'Reply must be 500 characters or less',
        body,
      });
    }

    // Verify parent post exists and is not a reply
    const parentPost = await prisma.post.findUnique({
      where: {
        id: params.postId,
      },
    });

    if (!parentPost) {
      return fail(404, {
        error: 'Post not found',
        body,
      });
    }

    if (parentPost.parentId) {
      return fail(400, {
        error: 'Cannot reply to a reply',
        body,
      });
    }

    // Check rate limit: 12 posts per day (replies count as posts)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const postsToday = await prisma.post.count({
      where: {
        userId: locals.user.id,
        createdAt: {
          gte: today,
        },
      },
    });

    if (postsToday >= 12) {
      return fail(429, {
        error: 'You have reached your daily limit of 12 posts. Try again tomorrow!',
        body,
      });
    }

    // Create reply and initial body history entry
    try {
      await prisma.$transaction(async (tx) => {
        const post = await tx.post.create({
          data: {
            body,
            userId: locals.user.id,
            parentId: params.postId,
          },
        });

        // Create initial body history entry
        await tx.postBody.create({
          data: {
            body,
            postId: post.id,
          },
        });
      });
    } catch (error) {
      console.error('Error creating reply:', error);
      return fail(500, {
        error: 'Failed to create reply',
        body,
      });
    }

    // Redirect back to feed
    redirect(303, '/feed');
  },
};
