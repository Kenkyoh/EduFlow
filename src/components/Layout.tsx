import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { NotificationsPanel } from './NotificationsPanel'
import { ToastContainer } from './Toast'
import { useSidebarStore } from '../store/sidebar'
import clsx from 'clsx'

export function Layout() {
  const collapsed = useSidebarStore(s => s.collapsed)

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900">
      <Sidebar />
      <main className={clsx(
        'min-h-screen pt-[60px] transition-all duration-300',
        collapsed ? 'md:ml-16' : 'md:ml-60'
      )}>
        <div className="max-w-[1200px] mx-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
      <NotificationsPanel />
      <ToastContainer />
    </div>
  )
}
