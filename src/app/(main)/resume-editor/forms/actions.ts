"use server";

import openai from "@/lib/openai";
import {
  ExperienceValues,
  GenerateExperienceInput,
  generateExperienceSchema,
  GenerateProjectInput,
  generateProjectSchema,
  GenerateSummaryInput,
  generateSummarySchema,
} from "@/lib/resumeSchema";
import { GitHubApiResponse } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";

export async function generateSummary(prompt: GenerateSummaryInput) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const { experiences, educations, skills } =
      generateSummarySchema.parse(prompt);

    // console.log("prompt::::::: ", prompt);

    const systemMessage = `
    You are a job resume generator AI. Your task is to write a professional introduction summary for a resume given the user's provided data.
    Only return the summary and do not include any other information in the response. Keep it concise and professional.
    `;

    const userMessage = `
    Please generate a professional resume summary from this data:

    Work experience:
    ${experiences
      ?.map(
        (exp) => `
        Position: ${exp.position || "N/A"} at ${exp.organization || "N/A"} from ${exp.startDate || "N/A"} to ${exp.endDate || "Present"}

        Description:
        ${exp.description || "N/A"}
        `,
      )
      .join("\n\n")}

      Education:
    ${educations
      ?.map(
        (edu) => `
        Degree: ${edu.degree || "N/A"} at ${edu.institution || "N/A"} from ${edu.startDate || "N/A"} to ${edu.endDate || "N/A"}
        `,
      )
      .join("\n\n")}

      Skills:
      ${skills}
    `;

    // console.log("systemMessage", systemMessage);
    // console.log("userMessage", userMessage);

    const completion = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct:free", // Use the correct model name
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    // console.log("AI Response:", completion.choices[0].message.content);
    const aiResponse = completion.choices[0].message.content?.trim();
    if (!aiResponse) {
      throw new Error("AI response is empty");
    }

    // console.log("AI Response:", aiResponse);

    return aiResponse;
  } catch (err) {
    console.error("AI Error:", err);
    return "Something went wrong.";
  }
}

export async function generateExperience(prompt: GenerateExperienceInput) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const { description } = generateExperienceSchema.parse(prompt);

    const systemMessage = `
You are a professional resume generator AI. Your task is to generate a single work experience entry based on the user input.
Your response must adhere to the following structure. You can omit fields if they can't be inferred from the provided data, but don't add any new ones.

Position: <job title/position>
Organization: <company name or organization>
Start date: <format: YYYY-MM-DD> (only if provided or can be reasonably inferred)
End date: <format: YYYY-MM-DD> (only if provided or can be reasonably inferred)
Description: <optimized description, each description key point on a new line without bullet points. Focus on achievements, responsibilities, and impact using action verbs and quantifiable results when possible>

Guidelines:
- Use strong action verbs (developed, implemented, managed, increased, etc.)
- Include quantifiable achievements when possible
- Focus on impact and results
- Keep bullets concise but informative
- Use professional language
  `;

    const userMessage = `
  Please provide a work experience entry from this description:
  ${description}

  Make the description compelling and professional, focusing on achievements and responsibilities.
  `;

    const completion = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const aiResponse = completion.choices[0].message.content;

    if (!aiResponse) {
      throw new Error("Failed to generate AI response");
    }

    // console.log("aiResponse", aiResponse);

    return {
      position: aiResponse.match(/Position: (.*)/)?.[1] || "",
      organization: aiResponse.match(/Organization: (.*)/)?.[1] || "",
      description: (
        aiResponse.match(/Description:([\s\S]*)/)?.[1] || ""
      ).trim(),
      startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
      endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
    };
  } catch (error) {
    console.error("Error generating experience:", error);
    throw new Error("Failed to generate experience");
  }
}

export async function generateProject(prompt: GenerateProjectInput) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const { description } = generateProjectSchema.parse(prompt);

    const systemMessage = `
You are a professional resume generator AI. Your task is to generate a single project entry based on the user input.
Your response must adhere to the following structure. You can omit fields if they can't be inferred from the provided data, but don't add any new ones.

Title: <project title/name>
URL: <project URL/link> (only if provided or can be reasonably inferred)
Start date: <format: YYYY-MM-DD> (only if provided or can be reasonably inferred)
End date: <format: YYYY-MM-DD> (only if provided or can be reasonably inferred)
Description: <detailed project description, each key point on a new line without bullet points. Focus on technologies used, features implemented, impact, and technical achievements>

Guidelines:
- Use technical action verbs (built, developed, implemented, designed, architected, etc.)
- Include specific technologies, frameworks, and tools used
- Mention key features and functionalities
- Include quantifiable results when possible (performance improvements, user metrics, etc.)
- Focus on technical challenges solved and solutions implemented
- Keep descriptions concise but informative
- Use professional technical language
    `;

    const userMessage = `
Please generate a project entry from this description:
${description}

Make the description compelling and technical, focusing on implementation details, technologies used, and project impact.
    `;

    const completion = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const aiResponse = completion.choices[0].message.content;

    if (!aiResponse) {
      throw new Error("Failed to generate AI response");
    }

    console.log("Project AI Response:", aiResponse);

    // Parse the response more robustly
    const title = aiResponse.match(/Title:\s*(.*?)(?:\n|$)/)?.[1]?.trim() || "";
    const url = aiResponse.match(/URL:\s*(.*?)(?:\n|$)/)?.[1]?.trim();
    const startDate = aiResponse.match(
      /Start date:\s*(\d{4}-\d{2}-\d{2})/,
    )?.[1];
    const endDate = aiResponse.match(/End date:\s*(\d{4}-\d{2}-\d{2})/)?.[1];

    // Extract description and clean up
    const descriptionMatch = aiResponse.match(/Description:\s*([\s\S]*)/)?.[1];
    let projectDescription = "";

    if (descriptionMatch) {
      projectDescription = descriptionMatch
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => line.replace(/^[•\-\*]\s*/, "")) // Remove bullet points
        .join("\n");
    }

    return {
      title,
      url: url || undefined,
      description: projectDescription,
      startDate,
      endDate,
    };
  } catch (error) {
    console.error("Error generating project:", error);
    throw new Error("Failed to generate project");
  }
}

// export async function fetchGitHubDataByUsername(username: string) {
//   try {
//     const { userId } = await auth();
//     if (!userId) {
//       throw new Error("User not authenticated");
//     }

//     const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

//     // console.log("URL: ", baseApiUrl)
//     const response = await fetch(`${baseUrl}/api/github?username=${username}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${process.env.CLERK_SECRET_KEY}`,
//       },
//       cache: "no-store", // Disable caching for this request
//     });

//     // console.log("Username:", username);

//     console.log("Response:: ", response);
//     console.log("Response headers:", Object.fromEntries(response.headers.entries()));

//     if (!response.ok) {
//       const errorText = await response.text();
//       // console.log("Error response text:", errorText);
      
//       // Handle HTML error pages
//       if (errorText.includes('<!DOCTYPE')) {
//         throw new Error('API route not found or not accessible');
//       }
      
//       let errorData;
//       try {
//         errorData = JSON.parse(errorText);
//       } catch {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }
      
//       throw new Error(errorData.message || "Failed to fetch GitHub data");
//     }

//     const data: GitHubApiResponse = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching GitHub data:", error);
//     throw error;
//   }
// }


export async function fetchGitHubDataByUsername(username: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    console.log("Fetching GitHub data for username:", username);

    if (!username || username.trim().length === 0) {
      throw new Error("Username is required");
    }

    const cleanUsername = username.trim();

    // Validate GitHub username format
    if (!/^[a-zA-Z0-9]([a-zA-Z0-9]|-)*[a-zA-Z0-9]$/.test(cleanUsername)) {
      throw new Error("Invalid GitHub username format");
    }

    // Check if GITHUB_TOKEN is available
    if (!process.env.GITHUB_TOKEN) {
      throw new Error("GitHub token not configured. Please add GITHUB_TOKEN to your environment variables.");
    }

    const headers = {
      'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'ByteProfile-App'
    };

    // Fetch user data
    console.log("Fetching user profile...");
    const userResponse = await fetch(`https://api.github.com/users/${cleanUsername}`, {
      headers,
      cache: 'no-store'
    });

    if (!userResponse.ok) {
      console.error(`GitHub API error: ${userResponse.status} ${userResponse.statusText}`);
      
      if (userResponse.status === 404) {
        throw new Error(`GitHub user '${cleanUsername}' not found`);
      }
      if (userResponse.status === 403) {
        const rateLimitReset = userResponse.headers.get('X-RateLimit-Reset');
        const resetTime = rateLimitReset ? new Date(parseInt(rateLimitReset) * 1000) : null;
        throw new Error(`GitHub API rate limit exceeded${resetTime ? `. Resets at ${resetTime.toLocaleTimeString()}` : '. Please try again later.'}`);
      }
      if (userResponse.status === 401) {
        throw new Error("GitHub API authentication failed. Please check your token.");
      }
      
      throw new Error(`GitHub API error: ${userResponse.status} ${userResponse.statusText}`);
    }

    const userData = await userResponse.json();
    console.log("User data fetched successfully");

    // Fetch repositories
    console.log("Fetching repositories...");
    const reposResponse = await fetch(
      `https://api.github.com/users/${cleanUsername}/repos?sort=stars&direction=desc&per_page=10&type=owner`,
      {
        headers,
        cache: 'no-store'
      }
    );

    let topRepos = [];

    if (!reposResponse.ok) {
      console.warn(`Failed to fetch repositories: ${reposResponse.status} ${reposResponse.statusText}`);
      // Continue with user data only if repos fail
    } else {
      const reposData = await reposResponse.json();
      
      // Filter and sort repositories
      topRepos = Array.isArray(reposData) 
        ? reposData
            .filter(repo => !repo.fork && !repo.archived) // Exclude forks and archived repos
            .slice(0, 3) // Limit to top 3 repositories
        : [];

      console.log(`Successfully fetched ${topRepos.length} repositories`);
    }

    // Return data in the expected format
    const result = {
      user: {
        name: userData.name || '',
        location: userData.location || '',
        html_url: userData.html_url || '',
        bio: userData.bio || '',
        avatar_url: userData.avatar_url || '',
        public_repos: userData.public_repos || 0,
        followers: userData.followers || 0,
        following: userData.following || 0,
      },
      topRepos: topRepos.map(repo => ({
        name: repo.name || '',
        html_url: repo.html_url || '',
        description: repo.description || '',
        language: repo.language || '',
        stargazers_count: repo.stargazers_count || 0,
        forks_count: repo.forks_count || 0,
        topics: repo.topics || [],
        created_at: repo.created_at || '',
        pushed_at: repo.pushed_at || '',
      }))
    };

    console.log("GitHub data processed successfully:", result);
    return result;

  } catch (error) {
    console.error("Error in fetchGitHubDataByUsername:", error);
    
    // Return more specific error messages
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    
    throw new Error("Failed to fetch GitHub data. Please check the username and try again.");
  }
}