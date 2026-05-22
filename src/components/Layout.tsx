import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { NotificationsPanel } from './NotificationsPanel'
import { ToastContainer } from './Toast'
import { useSidebarStore } from '../store/sidebar'
import clsx from 'clsx'

export function Layout() {
  const collapsed = useSidebarStore(s => s.collapsed)
  const { pathname } = useLocation()

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }) }, [pathname])

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900">
      <Sidebar />
      <main className={clsx(
        'min-h-screen pt-[60px] transition-all duration-300',
        collapsed ? 'md:ml-16' : 'md:ml-60'
      )}>
        <div key={pathname} className="max-w-[1200px] mx-auto p-4 md:p-6 pb-20 md:pb-6 animate-fade-up">
          <Outlet />
        </div>
      </main>
      <BottomNav />
      <NotificationsPanel />
      <ToastContainer />
    </div>
  )
}
