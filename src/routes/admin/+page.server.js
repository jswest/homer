import { fail } from '@sveltejs/kit';
import prisma from '$lib/prisma.js';

export const load = async () => {
  // Fetch all whitelisted emails
  const whitelistedEmails = await prisma.emailWhitelist.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Fetch all users
  const users = await prisma.user.findMany({
    select: {
      id: true,
      handle: true,
      email: true,
      createdAt: true,
      isAdmin: true,
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    whitelistedEmails,
    users,
  };
};

export const actions = {
  addEmail: async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get('email');

    if (!email || email.length === 0) {
      return fail(400, {
        error: 'Email is required',
      });
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return fail(400, {
        error: 'Invalid email format',
      });
    }

    try {
      await prisma.emailWhitelist.create({
        data: {
          email,
        },
      });
    } catch (error) {
      console.error('Error adding email to whitelist:', error);
      return fail(400, {
        error: 'Email is already whitelisted or failed to add',
      });
    }

    return { success: true, message: 'Email added to whitelist' };
  },

  removeEmail: async ({ request }) => {
    const formData = await request.formData();
    const emailId = formData.get('emailId');

    if (!emailId) {
      return fail(400, {
        error: 'Email ID is required',
      });
    }

    try {
      await prisma.emailWhitelist.delete({
        where: {
          id: emailId,
        },
      });
    } catch (error) {
      console.error('Error removing email from whitelist:', error);
      return fail(400, {
        error: 'Failed to remove email from whitelist',
      });
    }

    return { success: true, message: 'Email removed from whitelist' };
  },

  deleteUser: async ({ request, locals }) => {
    const formData = await request.formData();
    const userId = formData.get('userId');

    if (!userId) {
      return fail(400, {
        error: 'User ID is required',
      });
    }

    // Prevent admin from deleting themselves
    if (userId === locals.user.id) {
      return fail(400, {
        error: 'You cannot delete your own account',
      });
    }

    try {
      // Delete user (cascade will handle posts, follows, etc.)
      await prisma.user.delete({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      return fail(500, {
        error: 'Failed to delete user',
      });
    }

    return { success: true, message: 'User deleted successfully' };
  },
};
