"use client"

import { useState } from "react"
import { PlusIcon } from "@phosphor-icons/react"
import { api } from "@workspace/convex/api"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { cn } from "@workspace/ui/lib/utils"
import { useMutation } from "convex/react"
import { toast } from "sonner"

export default function NewTask() {
  const createTask = useMutation(api.tasks.createTask)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [expanded, setExpanded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = title.trim().length > 0 && !isSubmitting

  const reset = () => {
    setTitle("")
    setDescription("")
    setExpanded(false)
  }

  const onSubmit = async () => {
    const trimmedTitle = title.trim()
    const trimmedDescription = description.trim()

    if (!trimmedTitle) {
      toast.error("Title is required")
      return
    }

    if (trimmedTitle.length > 120) {
      toast.error("Title must be 120 characters or fewer")
      return
    }

    if (trimmedDescription.length > 500) {
      toast.error("Description must be 500 characters or fewer")
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createTask({
        title: trimmedTitle,
        description: trimmedDescription || undefined,
      })

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success(result.success)
      setTitle("")
      setDescription("")
      setExpanded(false)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong creating the task"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="group flex min-h-32 w-full flex-col justify-between rounded-[1.35rem] border border-dashed border-border/90 bg-transparent p-4 text-left transition-colors hover:bg-background/55"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <PlusIcon className="size-4" />
          Add task
        </span>

        <div className="space-y-1">
          <p className="font-medium">Start with a title</p>
          <p className="text-sm text-muted-foreground">
            Add notes inline and save when ready.
          </p>
        </div>
      </button>
    )
  }

  return (
    <article className="w-full rounded-[1.35rem] border border-dashed border-border/90 bg-background/62 p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <PlusIcon className="size-4" />
        Draft task
      </div>

      <div className="mt-3 space-y-3">
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Task title"
          className="h-9 rounded-none border-0 bg-transparent px-0 text-base font-medium shadow-none focus-visible:ring-0"
          maxLength={120}
          autoFocus
        />

        <Textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Optional notes or context"
          className="min-h-16 rounded-none border-0 bg-transparent px-0 py-0 text-sm text-muted-foreground shadow-none focus-visible:ring-0"
          maxLength={500}
        />

        <div className="flex items-center justify-between gap-3 pt-1">
          <p className="text-xs text-muted-foreground">
            Save adds it to the board.
          </p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={reset}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onSubmit}
              disabled={!canSubmit}
              className={cn(!canSubmit && "opacity-60")}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
