// Atividade pública do GitHub para a home.
//
// Com GITHUB_TOKEN: GraphQL entrega o calendário de contribuições exato
// (últimos 12 meses) + repositórios públicos + seguidores. Os commits
// recentes vêm de /events/public, única fonte pública com a mensagem.
// Sem token (ou se o GraphQL falhar): cai no REST público, sem calendário,
// mantendo o que estiver disponível. Falha de upstream nunca quebra a
// página: sempre 200 com um payload seguro.

const GITHUB_API = 'https://api.github.com';
const GITHUB_GRAPHQL = 'https://api.github.com/graphql';
const USERNAME = process.env.GITHUB_USERNAME || 'juliano340';
const TOKEN = process.env.GITHUB_TOKEN;

const MAX_COMMITS = 5;
const MESSAGE_MAX = 110;

const CONTRIBUTIONS_QUERY = `
  query GitHubActivity($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
      repositories(privacy: PUBLIC, ownerAffiliations: OWNER, first: 1) {
        totalCount
      }
      followers {
        totalCount
      }
    }
  }
`;

const authHeaders = (withToken = true) => ({
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'juliano340-site',
  ...(withToken && TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
});

// REST público: se o token estiver expirado/revogado (401), repete sem ele
// para o fallback não ficar vazio por causa de uma credencial inválida.
const fetchRestJson = async (path) => {
  const url = `${GITHUB_API}${path}`;

  const request = (withToken) =>
    fetch(url, {
      headers: authHeaders(withToken),
      signal: AbortSignal.timeout(8000),
    });

  try {
    let response = await request(true);
    if (response.status === 401) response = await request(false);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
};

const truncate = (text, max) => {
  const value = String(text || '').replace(/\s+/g, ' ').trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trimEnd()}…`;
};

const extractRecentCommits = (events) => {
  if (!Array.isArray(events)) return [];

  const seen = new Set();
  const commits = [];

  for (const event of events) {
    if (event?.type !== 'PushEvent') continue;

    const repo = event.repo?.name;
    if (!repo) continue;

    for (const commit of event.payload?.commits || []) {
      const sha = commit?.sha;
      if (!sha) continue;

      const key = `${repo}:${sha}`;
      if (seen.has(key)) continue;
      seen.add(key);

      commits.push({
        repo,
        message: truncate(commit.message?.split('\n')[0], MESSAGE_MAX) || 'Commit sem mensagem',
        sha,
        url: `https://github.com/${repo}/commit/${sha}`,
        date: commit.author?.date || event.created_at || null,
      });
    }
  }

  return commits
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, MAX_COMMITS);
};

const fetchSearchCommits = async () => {
  const query = encodeURIComponent(`author:${USERNAME}`);
  const response = await fetch(
    `${GITHUB_API}/search/commits?q=${query}&sort=author-date&order=desc&per_page=${MAX_COMMITS}`,
    {
      headers: authHeaders(),
      signal: AbortSignal.timeout(8000),
    }
  );
  if (!response.ok) return [];

  try {
    const json = await response.json();
    if (!Array.isArray(json?.items)) return [];

    return json.items.map((item) => ({
      repo: item.repository?.full_name || '',
      message: truncate(item.commit?.message?.split('\n')[0], MESSAGE_MAX) || 'Commit sem mensagem',
      sha: item.sha,
      url: item.html_url || `https://github.com/${item.repository?.full_name}/commit/${item.sha}`,
      date: item.commit?.author?.date || null,
    })).filter((commit) => commit.repo && commit.sha && commit.url);
  } catch {
    return [];
  }
};

const fetchRecentCommits = async () => {
  // A API de busca devolve mensagens e links; /events/public atualmente omite
  // payload.commits com frequência. Eventos ficam como fallback.
  const search = await fetchSearchCommits();
  if (search.length > 0) return search;

  const events = await fetchRestJson(
    `/users/${encodeURIComponent(USERNAME)}/events/public?per_page=100`
  );
  return extractRecentCommits(events);
};

const fetchUser = async () => fetchRestJson(`/users/${encodeURIComponent(USERNAME)}`);

const fetchContributions = async () => {
  if (!TOKEN) return null;

  const to = new Date();
  const from = new Date(to.getTime());
  from.setUTCFullYear(from.getUTCFullYear() - 1);
  from.setUTCDate(from.getUTCDate() + 1);

  try {
    const response = await fetch(GITHUB_GRAPHQL, {
      method: 'POST',
      headers: {
        ...authHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: { login: USERNAME, from: from.toISOString(), to: to.toISOString() },
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;

    const json = await response.json();
    if (json?.errors?.length) return null;

    const user = json?.data?.user;
    const calendar = user?.contributionsCollection?.contributionCalendar;
    if (!user || !calendar || !Array.isArray(calendar.weeks)) return null;

    return {
      totalContributions: Number(calendar.totalContributions) || 0,
      weeks: calendar.weeks.map((week) => ({
        days: (week.contributionDays || []).map((day) => ({
          date: day.date,
          count: Number(day.contributionCount) || 0,
        })),
      })),
      publicRepos: Number(user.repositories?.totalCount) || 0,
      followers: Number(user.followers?.totalCount) || 0,
    };
  } catch {
    return null;
  }
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method not allowed' });
  }

  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

  const [recentCommits, contributions] = await Promise.all([
    fetchRecentCommits(),
    fetchContributions(),
  ]);

  if (contributions) {
    return res.status(200).json({
      configured: Boolean(TOKEN),
      username: USERNAME,
      calendar: {
        totalContributions: contributions.totalContributions,
        weeks: contributions.weeks,
      },
      stats: {
        contributions: contributions.totalContributions,
        publicRepos: contributions.publicRepos,
        followers: contributions.followers,
      },
      recentCommits,
    });
  }

  // Fallback REST público: sem heatmap, mas com o que der para mostrar.
  const user = await fetchUser();

  return res.status(200).json({
    configured: Boolean(TOKEN),
    username: USERNAME,
    calendar: null,
    stats: {
      contributions: null,
      publicRepos: typeof user?.public_repos === 'number' ? user.public_repos : null,
      followers: typeof user?.followers === 'number' ? user.followers : null,
    },
    recentCommits,
  });
}
