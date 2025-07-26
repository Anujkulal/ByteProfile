import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Briefcase, CheckCircle } from "lucide-react"
import { generateExperience } from "../actions"
import { toast } from "sonner"

interface GenerateExperienceButtonProps {
  onGenerate: (experience: {
    position?: string;
    organization?: string;
    description?: string[];
    startDate?: string;
    endDate?: string;
  }) => void;
}

const GenerateExperienceButton = ({ onGenerate }: GenerateExperienceButtonProps) => {
  const [description, setDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error("Please enter a description")
      return
    }

    setIsGenerating(true)
    try {
      const result = await generateExperience({ description })
      
      // Convert description to array format
      const descriptionArray = result.description 
        ? result.description.split('\n').filter(line => line.trim())
        : []

      onGenerate({
        position: result.position,
        organization: result.organization,
        description: descriptionArray,
        startDate: result.startDate,
        endDate: result.endDate,
      })

      toast.success("Experience generated successfully!")
      setDescription("")
      setIsOpen(false)
    } catch (error) {
      console.error("Error generating experience:", error)
      toast.error("Failed to generate experience. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const examplePrompts = [
    "Software Engineer at Google working on machine learning",
    "Marketing Manager at startup focused on social media campaigns", 
    "Data Analyst at consulting firm analyzing client datasets",
    "Product Designer at tech company designing mobile apps"
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="generate" className="flex items-center gap-2">
          <Sparkles size={16} />
          AI Generate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-blue-600" />
            Generate Work Experience
          </DialogTitle>
          <DialogDescription>
            Describe your role or provide basic information, and AI will generate a complete work experience entry with optimized bullet points.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Experience Description
            </Label>
            <Textarea
              id="description"
              placeholder="e.g., Software Engineer at Microsoft working on Azure cloud services, or Marketing Manager at startup handling social media campaigns..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] resize-none"
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground">
              Be as specific as possible for better results
            </p>
          </div>

          {/* Example prompts */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Example prompts:</Label>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((prompt, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80 text-xs p-2 h-auto"
                  onClick={() => setDescription(prompt)}
                >
                  {prompt}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={isGenerating}>
              Cancel
            </Button>
          </DialogClose>
          <Button 
            onClick={handleGenerate} 
            disabled={!description.trim() || isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Generate Experience
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default GenerateExperienceButton