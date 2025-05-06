import DashboardStats from "./DashboardStats"
import ImplementationPlansInProgress from "../implementation-plan/ImplementationPlansInProgress"
import RecentInventoryLogs from "../inventory-management/RecentInventoryLogs"
import NotificationsPanel from "../notifications/RecentNotifications"
import NewServiceRequests from "../service-request/NewServiceRequests"

export default function Dashboard() {
  return (
    <div className="flex flex-col w-full min-h-screen p-8 overflow-y-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Operations Dashboard</h1>
          <p className="text-muted-foreground">Monitor implementation plans, service requests, and equipment logs</p>
        </div>

        {/* <div className="flex items-center gap-2">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="w-full pl-8 md:w-[200px] lg:w-[300px]" />
        </div>

        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
      </div> */}
      </div>
      <DashboardStats />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 mt-6">
        <div className="lg:col-span-3 space-y-6">
          <ImplementationPlansInProgress />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <NewServiceRequests />
            <RecentInventoryLogs />
          </div>
        </div>

        <NotificationsPanel />
      </div>
    </div>
  )
}