import { error, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  const { session } = await locals.safeGetSession();

  if (!session) {
    redirect(303, '/');
  }

  if (!locals.user) {
    redirect(303, '/profile');
  }

  // Check if user is admin
  if (!locals.user.isAdmin) {
    error(403, 'You do not have permission to access this page');
  }

  return {
    user: locals.user,
  };
};
