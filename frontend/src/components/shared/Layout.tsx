// src/components/shared/Layout.tsx
// ─────────────────────────────────────────────────────────────────────────────
// App shell: sidebar + main scrollable content area.

import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
