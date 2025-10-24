import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma.js';

export async function GET({ url }) {
  const handle = url.searchParams.get('handle');

  if (!handle) {
    return json({ error: 'Handle is required' }, { status: 400 });
  }

  // Validate handle format
  if (!/^[a-zA-Z0-9_]+$/.test(handle)) {
    return json({ available: false, error: 'Invalid handle format' });
  }

  if (handle.length > 20) {
    return json({ available: false, error: 'Handle too long' });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { handle },
    });

    return json({ available: !existingUser });
  } catch (error) {
    console.error('Error checking handle:', error);
    return json({ error: 'Failed to check handle' }, { status: 500 });
  }
}
