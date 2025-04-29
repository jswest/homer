import prisma from '$lib/prisma';

export const load = (async () => {
	const response = await prisma.user.findMany();
	return { users: response };
})