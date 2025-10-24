import { json } from '@sveltejs/kit';
import { OPENAI_API_KEY, CRON_SECRET } from '$env/static/private';
import prisma from '$lib/prisma.js';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export async function GET({ request }) {
  // Verify cron secret for security
  const authHeader = request.headers.get('authorization');
  const expectedAuth = `Bearer ${CRON_SECRET}`;

  if (authHeader !== expectedAuth) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results = {
    processed: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  try {
    // Fetch posts that need summarization (summarizationCount < 6)
    const posts = await prisma.post.findMany({
      where: {
        summarizationCount: {
          lt: 6,
        },
      },
      take: 20, // Process 20 posts per run to avoid timeouts
      orderBy: {
        createdAt: 'asc', // Oldest first
      },
    });

    console.log(`Found ${posts.length} posts to summarize`);

    for (const post of posts) {
      try {
        // Call OpenAI to summarize
        const completion = await openai.chat.completions.create({
          model: 'gpt-5-nano',
          messages: [
            {
              role: 'system',
              content: 'You are a text summarization assistant. Summarize the given text to be shorter while preserving its core meaning. Return ONLY the summary text with no additional commentary.',
            },
            {
              role: 'user',
              content: `Summarize this text to be shorter:\n\n${post.body}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 300,
        });

        const summary = completion.choices[0]?.message?.content?.trim();

        if (!summary) {
          results.failed++;
          results.errors.push({
            postId: post.id,
            error: 'No summary returned from OpenAI',
          });
          continue;
        }

        // Verify summary is shorter than original
        if (summary.length >= post.body.length) {
          console.log(`Summary not shorter for post ${post.id}, skipping`);
          results.skipped++;

          // Still increment count so we don't keep trying
          await prisma.post.update({
            where: { id: post.id },
            data: {
              summarizationCount: {
                increment: 1,
              },
            },
          });
          continue;
        }

        // Update post with summary
        await prisma.post.update({
          where: { id: post.id },
          data: {
            body: summary,
            summarizationCount: {
              increment: 1,
            },
          },
        });

        results.processed++;
        console.log(`Summarized post ${post.id}: ${post.body.length} → ${summary.length} chars`);
      } catch (error) {
        results.failed++;
        results.errors.push({
          postId: post.id,
          error: error.message,
        });
        console.error(`Error summarizing post ${post.id}:`, error);
      }
    }

    return json({
      success: true,
      results,
      totalFound: posts.length,
    });
  } catch (error) {
    console.error('Error in summarization cron:', error);
    return json(
      {
        success: false,
        error: error.message,
        results,
      },
      { status: 500 }
    );
  }
}
