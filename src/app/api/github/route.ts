import { ErrorResponse, GitHubApiResponse, GitHubRepo, GitHubUser } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
): Promise<NextResponse<GitHubApiResponse | ErrorResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    console.log("Fetching GitHub data for username:", username);

    if (!username) {
      return NextResponse.json(
        {
          error: "Username is required",
          message: "Please provide a GitHub username in the query parameters.",
        } satisfies ErrorResponse,
        { status: 400 },
      );
    }

    if (!process.env.GITHUB_TOKEN) {
      return NextResponse.json(
        {
          error: "GitHub token is not configured",
          message: "Please set the GITHUB_TOKEN environment variable.",
        } satisfies ErrorResponse,
        { status: 500 },
      );
    }

    const headers = {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "ByteProfile-App",
    };

    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers,
        next: { revalidate: 3600 }, // Cache for 1 hour
      }),
      fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`,
        { headers, next: { revalidate: 3600 } }, // Cache for 1 hour
      ),
    ]);

    if(!userResponse.ok){
        if(userResponse.status === 404){
            return NextResponse.json({
                error: "User not found",
                message: `No GitHub user found with username: ${username}`,
            } satisfies ErrorResponse, { status: 404 });
        }
        if (userResponse.status === 403) {
        return NextResponse.json(
          { error: 'API rate limit exceeded', message: 'GitHub API rate limit reached' },
          { status: 429 }
        );
      }
      throw new Error(`GitHub API error: ${userResponse.status}`);
    }

    if (!reposResponse.ok) {
      throw new Error(`GitHub repos API error: ${reposResponse.status}`);
    }

    const user: GitHubUser = await userResponse.json();
    const repos: GitHubRepo[] = await reposResponse.json();

    // Filter out forks and sort repos by stars, then by update date
    const topRepos = repos
      .filter((repo) => !repo.fork) // Exclude forked repositories
      .sort((a, b) => {
        // Primary sort: by stars (descending)
        if (b.stargazers_count !== a.stargazers_count) {
          return b.stargazers_count - a.stargazers_count;
        }
        // Secondary sort: by last updated (descending)
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      })
      .slice(0, 3); // Get top 3 repositories

    const response: GitHubApiResponse = {
      user,
      topRepos,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });

  } catch (error) {
    console.error('GitHub API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
