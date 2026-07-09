import type { ReactNode } from "react";
import CrmSidebar from "@/components/crm/CrmSidebar";

export const metadata = {
  title: "CRM — ИРУ",
  description: "CRM система для управления клиентами, заказами и задачами",
};

export default function CrmLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-80px)]">
      <CrmSidebar />
      <main className="flex-1 overflow-auto bg-surface-alt">
        {children}
      </main>
    </div>
  );
}
