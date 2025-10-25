import { redirect, fail } from '@sveltejs/kit';
import prisma from '$lib/prisma.js';

export const actions = {
  signin: async ({ request, locals }) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    const { error } = await locals.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return fail(400, {
        error: error.message,
        email,
      });
    }

    redirect(303, '/feed');
  },

  signup: async ({ request, locals }) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');
    const handle = formData.get('handle');

    // Check if email is whitelisted
    try {
      const whitelisted = await prisma.emailWhitelist.findUnique({
        where: { email },
      });

      if (!whitelisted) {
        return fail(403, {
          error: 'This email is not authorized to create an account. Please contact an administrator.',
          email,
          handle,
        });
      }
    } catch (error) {
      console.error('Error checking whitelist:', error);
      return fail(500, {
        error: 'Failed to verify email authorization',
        email,
        handle,
      });
    }

    // Validate handle
    if (!handle || handle.length === 0) {
      return fail(400, {
        error: 'Handle is required',
        email,
        handle,
      });
    }

    if (handle.length > 20) {
      return fail(400, {
        error: 'Handle must be 20 characters or less',
        email,
        handle,
      });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(handle)) {
      return fail(400, {
        error: 'Handle must only contain letters, numbers, and underscores',
        email,
        handle,
      });
    }

    // Check if handle is already taken
    try {
      const existingUser = await prisma.user.findUnique({
        where: { handle },
      });

      if (existingUser) {
        return fail(400, {
          error: 'Handle is already taken',
          email,
          handle,
        });
      }
    } catch (error) {
      console.error('Error checking handle:', error);
      return fail(500, {
        error: 'Failed to check handle availability',
        email,
        handle,
      });
    }

    // Create Supabase auth user
    const { data: authData, error: authError } = await locals.supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return fail(400, {
        error: authError.message,
        email,
        handle,
      });
    }

    // Create user in our database
    try {
      await prisma.user.create({
        data: {
          email,
          handle,
          biography: '',
        },
      });
    } catch (error) {
      console.error('Error creating user in database:', error);
      // Note: The Supabase auth user was created, but database user failed
      // You may want to handle this more gracefully in production
      return fail(500, {
        error: 'Account created but profile setup failed. Please contact support.',
        email,
        handle,
      });
    }

    return {
      success: true,
      message: 'Account created! Check your email to confirm, then sign in.',
    };
  },
};
