import { Button } from '@/components/ui/button'
import { Github, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from 'react'
import { fetchGitHubDataByUsername } from '../actions'
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { ResumeValues } from '@/lib/resumeSchema';

interface FetchGithubDataButtonProps {
  resumeData: ResumeValues;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeValues>>;
}

const FetchGithubDataButton = ({ resumeData, setResumeData }: FetchGithubDataButtonProps) => {
  const { user } = useUser();
  const [username, setUsername] = useState(user?.username || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = async () => {
    if (!username.trim()) {
      toast.error("Please enter a GitHub username");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Fetching GitHub data for:", username);
      const data = await fetchGitHubDataByUsername(username.trim());
      console.log("Fetched GitHub data:", data);

      // Parse the name into firstName and lastName
      const fullName = data.user.name || '';
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Transform top repos into project format
      const projectsFromRepos = data.topRepos.map((repo) => ({
        title: repo.name,
        url: repo.html_url,
        description: [
          repo.description || `A ${repo.language || 'software'} project`,
          `⭐ ${repo.stargazers_count} stars • 🍴 ${repo.forks_count} forks`,
          `Built with ${repo.language || 'various technologies'}`,
          ...(repo.topics && repo.topics.length > 0 
            ? [`Topics: ${repo.topics.join(', ')}`] 
            : []
          )
        ].filter(Boolean),
        startDate: repo.created_at ? new Date(repo.created_at).toISOString().split('T')[0] : undefined,
        endDate: repo.pushed_at ? new Date(repo.pushed_at).toISOString().split('T')[0] : undefined,
      }));

      // Update resume data
      setResumeData((prevData: ResumeValues) => ({
        ...prevData,
        // Set name fields
        firstName: firstName || prevData.firstName,
        lastName: lastName || prevData.lastName,
        
        // Set location
        city: data.user.location || prevData.city,
        
        // Set GitHub URL
        githubUrl: data.user.html_url || prevData.githubUrl,
        
        // Add bio to summary if not already present
        summary: data.user.bio || prevData.summary,
        
        // Add projects from repos (append to existing projects)
        projects: [
          ...(prevData.projects || []),
          ...projectsFromRepos
        ],
      }));

      toast.success(`Successfully imported data from GitHub! Added ${projectsFromRepos.length} projects.`);
      setIsOpen(false);

    } catch (error) {
      console.error("Error fetching GitHub data:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch GitHub data';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Github className="h-4 w-4" />
          Link GitHub
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            Connect GitHub
          </DialogTitle>
          <DialogDescription>
            Enter your GitHub username to import your profile information and top repositories.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="github-username">GitHub Username</Label>
            <Input
              id="github-username"
              placeholder="e.g., octocat"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="font-mono"
            />
          </div>
          
          {/* Preview what will be imported */}
          <div className="rounded-lg bg-muted/50 p-3 text-sm">
            <h4 className="font-medium mb-2">What will be imported:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Profile name → First & Last name</li>
              <li>• Location → City</li>
              <li>• GitHub profile URL</li>
              <li>• Bio → Summary (if available)</li>
              <li>• Top repositories → Projects</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSave}
            disabled={!username.trim() || isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Github className="h-4 w-4" />
                Import Data
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default FetchGithubDataButton