import prisma from "$lib/prisma";

export const load = async ({ request, params }) => {
  const response = await prisma.user.findUnique({ where: { handle: params.handle } });
  return { user: response };
};
