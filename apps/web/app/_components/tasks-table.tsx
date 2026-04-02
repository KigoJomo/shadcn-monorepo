"use client"

import { api } from "@workspace/convex/api"
import { Id } from "@workspace/convex/dataModel"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react"

export default function TasksTable({
  preloadedTasks,
}: {
  preloadedTasks: Preloaded<typeof api.tasks.getAllTasks>
}) {
  const tasks = usePreloadedQuery(preloadedTasks)

  const updateTask = useMutation(api.tasks.updateTask)

  const toggleTaskCompletion = async ({
    id,
    newState,
  }: {
    id: Id<"tasks">
    newState: boolean
  }) => {
    await updateTask({ id, completed: newState })
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="text-muted">
            <TableHead className="w-16"></TableHead>
            <TableHead className="w-1/3">Title</TableHead>
            <TableHead className="w-1/3">Description</TableHead>
            <TableHead>Due</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tasks.map((t) => (
            <TableRow key={t._id}>
              <TableCell>
                <Checkbox
                  checked={t.completed}
                  onCheckedChange={(c) =>
                    toggleTaskCompletion({
                      id: t._id,
                      newState: c === "indeterminate" ? !t.completed : c,
                    })
                  }
                />
              </TableCell>
              <TableCell className="">{t.title}</TableCell>
              <TableCell className="text-muted-foreground">
                {t.description ?? "---"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {t.due_date ?? "---"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
