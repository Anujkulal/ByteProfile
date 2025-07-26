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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Code, CheckCircle } from "lucide-react"
import { generateProject } from "../actions"
import { toast } from "sonner"

interface GenerateProjectButtonProps {
  onGenerate: (project: {
    title?: string;
    url?: string;
    description?: string[];
    startDate?: string;
    endDate?: string;
  }) => void;
}

const GenerateProjectButton = ({ onGenerate }: GenerateProjectButtonProps) => {
  const [description, setDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error("Please enter a project description")
      return
    }

    setIsGenerating(true)
    try {
      const result = await generateProject({ description })
      
      // Convert description to array format
      const descriptionArray = result.description 
        ? result.description.split('\n').filter(line => line.trim())
        : []

      onGenerate({
        title: result.title,
        url: result.url,
        description: descriptionArray,
        startDate: result.startDate,
        endDate: result.endDate,
      })

      toast.success("Project generated successfully!")
      setDescription("")
      setIsOpen(false)
    } catch (error) {
      console.error("Error generating project:", error)
      toast.error("Failed to generate project. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const examplePrompts = [
    "E-commerce website built with React and Node.js with payment integration",
    "Mobile app for task management using React Native and Firebase", 
    "Machine learning model for image classification using Python and TensorFlow",
    "REST API for social media platform with authentication and real-time features"
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
            <Code className="h-5 w-5 text-blue-600" />
            Generate Project Entry
          </DialogTitle>
          <DialogDescription>
            Describe your project or provide basic information, and AI will generate a complete project entry with technical details and achievements.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Project Description
            </Label>
            <Textarea
              id="description"
              placeholder="e.g., E-commerce website built with React and Node.js, or Mobile app for fitness tracking using React Native..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] resize-none"
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground">
              Include technologies used, features, and any notable achievements
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
                Generate Project
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default GenerateProjectButton