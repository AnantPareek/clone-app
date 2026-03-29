import { Outlet } from 'react-router-dom'
import AdminShellHeader from './admin/AdminShellHeader'

export default function AppShell() {
  return (
    <div className="min-h-screen bg-[#ececee] p-3 sm:p-5">
      <div className="min-h-[calc(100vh-24px)] rounded-[2rem] border border-neutral-300 bg-[#f5f5f6] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:min-h-[calc(100vh-40px)]">
        <AdminShellHeader />
        <main className="mx-auto w-full max-w-[1240px] px-4 pb-20 pt-8 sm:px-7 sm:pt-10 lg:px-10">
          <div className="rounded-[1.75rem] border border-neutral-200/90 bg-[#f7f7f8] px-5 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] sm:px-7 sm:py-8 lg:px-10 lg:py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
