export const load = async ({ locals }) => {
  return {
    session: locals.session,
    user: locals.user,
    cookies: locals.cookies,
  };
};
