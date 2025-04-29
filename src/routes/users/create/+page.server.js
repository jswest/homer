import prisma from "$lib/prisma";

import { fail, redirect } from "@sveltejs/kit";

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    let biography = data.get("biography");
    let email = data.get("email");
    let handle = data.get("handle");

    if (
      typeof biography !== "string" ||
      typeof email !== "string" ||
      typeof handle !== "string"
    ) {
      return fail(400, { incorrect: true });
    }

    handle = handle.toLowerCase().replace(/[^a-z0-9_]/g, "");

    if (handle.length < 1) {
      return fail(400, { incorrect: true });
    }

    if (!email || !handle) {
      return fail(400, { email, handle, missing: true });
    }

    const user = await prisma.user.create({
      data: {
        biography,
        email,
        handle,
      },
    });
    console.log(user);
    throw redirect(303, `/users/${user.handle}`);
  },
};
