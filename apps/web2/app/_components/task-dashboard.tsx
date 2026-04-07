"use client"

import { useState } from "react"
import { ClockCountdownIcon } from "@phosphor-icons/react"
import { api } from "@workspace/convex/api"
import { type Id } from "@workspace/convex/dataModel"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"
import { Separator } from "@workspace/ui/components/separator"
import { cn } from "@workspace/ui/lib/utils"
import { type Preloaded, useMutation, usePreloadedQuery } from "convex/react"
import { toast } from "sonner"
import NewTask from "@/app/_components/new-task"

type Filter = "all" | "incomplete" | "complete"

const filters: Array<{ key: Filter; label: string }> = [
  { key: "all", label: "All" },
  { key: "incomplete", label: "Incomplete" },
  { key: "complete", label: "Complete" },
]

function formatUpdatedAt(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "Just now"
  }

  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

function formatDueDate(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Intl.DateTimeFormat(undefined, {
      day: "numeric",
      month: "short",
    }).format(new Date(value))
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value
  }

  return "No deadline"
}

export default function TaskDashboard({
  preloadedTasks,
}: {
  preloadedTasks: Preloaded<typeof api.tasks.getAllTasks>
}) {
  const tasks = usePreloadedQuery(preloadedTasks)
  const updateTask = useMutation(api.tasks.updateTask)
  const [filter, setFilter] = useState<Filter>("all")

  const visibleTasks = tasks.filter((task) => {
    if (filter === "incomplete") {
      return !task.completed
    }

    if (filter === "complete") {
      return task.completed
    }

    return true
  })

  const toggleTaskCompletion = async ({
    id,
    newState,
  }: {
    id: Id<"tasks">
    newState: boolean
  }) => {
    try {
      const result = await updateTask({
        id,
        completed: newState,
      })

      if (result.error) {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong updating the task"
      )
    }
  }

  const emptyTitle =
    tasks.length === 0
      ? "No tasks yet"
      : filter === "incomplete"
        ? "No incomplete tasks"
        : filter === "complete"
          ? "No complete tasks"
          : "Nothing to show"

  const emptyDescription =
    tasks.length === 0
      ? "Create a task to get the board moving."
      : "Switch filters or add another task."

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
      <section className="flex flex-col gap-4">
        <h1>
          Get <span className="italic">s#!+</span> done
        </h1>

        <Separator />

        <div className="flex w-fit flex-wrap gap-2 rounded-full border bg-background/70 p-1">
          {filters.map((option) => (
            <Button
              key={option.key}
              variant={filter === option.key ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(option.key)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </section>

      {visibleTasks.length === 0 ? (
        <>
          <NewTask />
          <Empty className="rounded-[1.5rem] border bg-background/70 py-20">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ClockCountdownIcon className="size-5" />
              </EmptyMedia>
              <EmptyTitle>{emptyTitle}</EmptyTitle>
              <EmptyDescription>{emptyDescription}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </>
      ) : (
        <section className="grid auto-rows-min items-start gap-3 md:grid-cols-2 xl:grid-cols-3">
          <NewTask />
          {visibleTasks.map((task) => (
            <Card
              key={task._id}
              className={cn(
                "gap-3 border border-border/80 bg-background/84 py-3 shadow-sm",
                task.completed &&
                  "border-dashed bg-background/52 text-muted-foreground"
              )}
            >
              <CardHeader className="gap-2 px-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.completed}
                    aria-label={
                      task.completed
                        ? `Mark ${task.title} as incomplete`
                        : `Mark ${task.title} as complete`
                    }
                    onCheckedChange={(checked) =>
                      toggleTaskCompletion({
                        id: task._id,
                        newState:
                          checked === "indeterminate"
                            ? !task.completed
                            : checked,
                      })
                    }
                  />

                  <CardTitle
                    className={cn(
                      "text-[1.05rem] leading-snug",
                      task.completed && "line-through"
                    )}
                  >
                    {task.title}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 px-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  {task.description?.trim() || "No description yet."}
                </p>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                  <span>
                    Updated{" "}
                    {formatUpdatedAt(task.updated_at ?? task._creationTime)}
                  </span>
                  <span className="size-1 rounded-full bg-border" />
                  <span>{formatDueDate(task.due_date)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </main>
  )
}
