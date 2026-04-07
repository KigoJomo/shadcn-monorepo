import TaskDashboard from "@/app/_components/task-dashboard"
import { api } from "@workspace/convex/api"
import { preloadQuery } from "convex/nextjs"

export default async function Home() {
  const tasks = await preloadQuery(api.tasks.getAllTasks)

  return <TaskDashboard preloadedTasks={tasks} />
}
