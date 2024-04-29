import SideBar from "@/components/admin/Sidebar/SideBar";

export default function AdminLayout({ children }: any) {
  return (
    <div className="flex overflow-hidden h-min">
      <SideBar />
      <main className="overflow-auto w-full p-2">{children}</main>
    </div>
  );
}
