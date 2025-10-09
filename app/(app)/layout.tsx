import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { mockRootProps } from "@/lib/mockData";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen bg-base-100 p-8">
      <div className="flex gap-6 h-full">
        {/* Sidebar */}
        <Sidebar />

        <main className="h-full w-full flex flex-col">
          <Navbar user={mockRootProps.user} />
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}