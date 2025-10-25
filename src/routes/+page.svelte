<script>
  import AuthForm from "$lib/components/AuthForm.svelte";
  import Button from "$lib/components/Button.svelte";

  let { data, form } = $props();
</script>

{#if data.session}
  <div class="logged-in-actions">
    <a href="/feed">
      <Button>See the Feed</Button>
    </a>
  </div>
{:else}
  <AuthForm {form} />
{/if}

<div class="about">
  <h1>What is this, really?</h1>

  <p>
    Over on Bluesky, Marcus Merritt, an artist and poet (who I don’t know),
    <a href="https://bsky.app/profile/marcusjmerritt.com/post/3ltwntr7btk2o"
      >proposed</a
    > a fake Borges story—one he might have written had he seen the Lovecraftian
    face of the AI-supercharged attention economy rise out of Silicon Valley. It
    goes like this:
  </p>
  <blockquote>
    <p>
      A man asks AI to summarize all the world’s information for him, and then
      summarize the summary, until the AI has the whole world summarized into a
      single word. He sits alone at his desk, staring at the word, repeating it
      endlessly, certain he is experiencing everything
    </p>
  </blockquote>
  <p>
    Like so many of the Argentine writers’ actual stories, I couldn’t get this
    one out of my head. A parable about compression, it plays on Borges’s
    map—his story about the useless horror of a map with perfect fidelity to
    reality. It touches on the Borges’s Library or Babel—his story about every
    book that could ever exist, which drives its librarians mad. It’s also just
    funny.
  </p>
  <p>
    And like the best Borges conceits, it has the ring of prophecy. The man at
    the desk is all of us now: scrolling, summarizing, consuming endless
    “content” whose abundance is only a disguise for its emptiness. AI slop,
    despite its volume, turns out to be rather thin gruel.
  </p>
  <p>
    I had a question—a bad question given that Merritt was making a pretty good
    joke. Why not actually make it?
  </p>
  <p>
    Enter HOMER, my piece of digital performance art masquerading as a social
    media platform, a microblogging platform where every hour, every post is run
    through AI summarization, until it can’t really be summarized much more,
    until all we have left to do is repeat a single word again and again,
    certain we finally understand.
  </p>

  <h1>Who made this?</h1>
  <p>
    John West is a writer and technologist. He currently reports the news with
    code at the Wall Street Journal, where <a
      href="https://www.wsj.com/news/author/john-west">his work</a
    > has received multiple awards including two Pulitzer prizes.
  </p>
  <p>
    The Boston Globe called his <a
      href="https://www.amazon.com/Lessons-Carols-Meditation-John-West/dp/0802882498"
      >first book</a
    >,
    <em
      >Lessons and Carols, “lyrical and crystalline.” His second book, <em
        >The Internet Will Die, And So Will You</em
      >, a digital memento mori, is expected in 2026.
    </em>
  </p>
  <p>
    He holds an M.F.A. in writing from the Bennington Writing Seminars and
    degrees in philosophy and music performance from Oberlin College. He lives
    outside Kingston, New York, with his partner, daughter, and unruly cat.
  </p>
</div>

<style>
  .logged-in-actions {
    margin-bottom: var(--unit);
  }

  .logged-in-actions a {
    text-decoration: none;
  }

  .about {
    margin-top: var(--unit);
  }
  .about h1 {
    font-weight: 800;
    margin-bottom: var(--unit);
  }
  .about blockquote {
    border-left: 3px solid black;
    margin-left: var(--unit);
    padding-left: var(--unit);
  }
  .about p {
    margin-bottom: var(--unit);
  }
  .about p a {
    color: var(--color-lime);
    font-weight: 900;
  }
</style>
