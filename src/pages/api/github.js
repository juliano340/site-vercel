// Atividade pública do GitHub para a home.
//
// Com GITHUB_TOKEN: GraphQL entrega o calendário de contribuições exato
// (últimos 12 meses) + repositórios públicos + seguidores.
// Sem token (ou se o GraphQL falhar): cai no REST público, sem calendário,
// mantendo o que estiver disponível. Falha de upstream nunca quebra a
// página: sempre 200 com um payload seguro.

const GITHUB_API = 'https://api.github.com';
const GITHUB_GRAPHQL = 'https://api.github.com/graphql';
const USERNAME = process.env.GITHUB_USERNAME || 'juliano340';
const TOKEN = process.env.GITHUB_TOKEN;

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

  const contributions = await fetchContributions();

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
  });
}
