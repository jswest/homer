import { fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma.js';

export const load = async ({ locals }) => {
  const { session } = await locals.safeGetSession();

  if (!session) {
    redirect(303, '/');
  }

  if (!locals.user) {
    redirect(303, '/profile');
  }

  return {
    user: locals.user,
  };
};

export const actions = {
  default: async ({ request, locals }) => {
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
        error: 'Post body is required',
        body,
      });
    }

    if (body.length > 500) {
      return fail(400, {
        error: 'Post must be 500 characters or less',
        body,
      });
    }

    // Check rate limit: 12 posts per day
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

    // Create post
    try {
      await prisma.post.create({
        data: {
          body,
          userId: locals.user.id,
        },
      });
    } catch (error) {
      console.error('Error creating post:', error);
      return fail(500, {
        error: 'Failed to create post',
        body,
      });
    }

    // Redirect after successful creation
    redirect(303, '/feed');
  },
};
