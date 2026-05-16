import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { NotificationsPanel } from './NotificationsPanel'
import { ToastContainer } from './Toast'

export function Layout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <main className="ml-60 min-h-screen pt-[60px]">
        <div className="max-w-[1200px] mx-auto p-6">
          <Outlet />
        </div>
      </main>
      <NotificationsPanel />
      <ToastContainer />
    </div>
  )
}
