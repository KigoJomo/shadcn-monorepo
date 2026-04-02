import NewTask from "@/app/_components/new-task"
import { api } from "@workspace/convex/api"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { preloadQuery } from "convex/nextjs"
import TasksTable from "./_components/tasks-table"

export default async function Home() {
  const tasks = await preloadQuery(api.tasks.getAllTasks)

  return (
    <>
      <div className="fixed -top-48 -left-48 -z-5 aspect-square w-xl rounded-full bg-primary opacity-15 blur-3xl"></div>
      <div className="fixed -right-48 -bottom-48 -z-5 aspect-square w-xl rounded-full bg-primary opacity-5 blur-3xl"></div>

      <div className="fixed bottom-0 left-0 -z-10 grid h-[30vh] w-screen grid-cols-36 grid-rows-8">
        {[...Array(36 * 8)].map((_, i) => (
          <div key={i} className="-z-20 border"></div>
        ))}

        <div className="absolute -z-10 h-full w-full bg-linear-0 from-background/50 via-background/70 to-background/90"></div>
      </div>

      <section className="mx-auto flex h-dvh max-w-4xl flex-col items-center gap-4 p-4 md:gap-8 md:p-12">
        <div className="flex w-full items-center justify-between gap-4">
          <h2>
            Get <span className="italic">s#!+</span> done
          </h2>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>
              <p className="font-medium">Hey dude :)</p>
            </CardTitle>
            <CardDescription>You&apos;ve got to lock in, mf!</CardDescription>

            <CardAction>
              <NewTask />
            </CardAction>
          </CardHeader>

          <CardContent className="mt-4">
            <TasksTable preloadedTasks={tasks} />
          </CardContent>
        </Card>
      </section>
    </>
  )
}
