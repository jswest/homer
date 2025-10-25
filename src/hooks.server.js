export const runtime = 'node';

import { createServerClient } from "@supabase/ssr";
import { redirect } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

import prisma from "$lib/prisma.js";

import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
} from "$env/static/public";

const supabase = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => event.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            event.cookies.set(name, value, { ...options, path: "/" });
          });
        },
      },
    }
  );

  event.locals.safeGetSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();
    if (!session) {
      return { session: null, user: null };
    }

    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser();
    if (error) {
      return { session: null, user: null };
    }

    return { session, user };
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range" || name === "x-supabase-api-version";
    },
  });
};

const authGuard = async ({ event, resolve }) => {
  const { session, user } = await event.locals.safeGetSession();
  event.locals.session = session;

  let actualUser = null;
  if (user?.email) {
    actualUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });
  }
  event.locals.user = actualUser;

  // Skip auth guard for API routes
  if (event.url.pathname.startsWith("/api/")) {
    return resolve(event);
  }

  // Protect all routes except the home page (sign-in page) and everyone feed
  const publicPaths = ["/", "/feed"];
  const isPublicPath = publicPaths.includes(event.url.pathname);

  if (!event.locals.session && !isPublicPath) {
    redirect(303, "/");
  }

  return resolve(event);
};

export const handle = sequence(supabase, authGuard);
