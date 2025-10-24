import { fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma.js';

export const load = async ({ locals }) => {
  const { session } = await locals.safeGetSession();

  if (!session) {
    redirect(303, '/');
  }

  return {
    user: locals.user,
  };
};

export const actions = {
  update: async ({ request, locals }) => {
    const { session, user: supabaseUser } = await locals.safeGetSession();

    if (!session) {
      redirect(303, '/');
    }

    const formData = await request.formData();
    const handle = formData.get('handle');
    const biography = formData.get('biography');

    // Validate handle
    if (!handle || handle.length === 0) {
      return fail(400, {
        error: 'Handle is required',
        handle,
        biography,
      });
    }

    if (handle.length > 20) {
      return fail(400, {
        error: 'Handle must be 20 characters or less',
        handle,
        biography,
      });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(handle)) {
      return fail(400, {
        error: 'Handle must only contain letters, numbers, and underscores',
        handle,
        biography,
      });
    }

    // Validate biography
    if (biography && biography.length > 500) {
      return fail(400, {
        error: 'Biography must be 500 characters or less',
        handle,
        biography,
      });
    }

    try {
      // Check if handle is taken by another user
      if (handle !== locals.user?.handle) {
        const existingUser = await prisma.user.findUnique({
          where: { handle },
        });

        if (existingUser) {
          return fail(400, {
            error: 'Handle is already taken',
            handle,
            biography,
          });
        }
      }

      // Update or create user
      if (locals.user) {
        await prisma.user.update({
          where: { id: locals.user.id },
          data: {
            handle,
            biography: biography || '',
          },
        });
      } else {
        // Create new user if they don't exist in our database yet
        await prisma.user.create({
          data: {
            email: supabaseUser.email,
            handle,
            biography: biography || '',
          },
        });
      }

      return {
        success: true,
        message: 'Profile updated successfully',
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      return fail(500, {
        error: 'Failed to update profile',
        handle,
        biography,
      });
    }
  },
};
