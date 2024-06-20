"use client";
import CategoryIcon from "@mui/icons-material/Category";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EditNoteIcon from "@mui/icons-material/EditNote";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { Tab, Tabs, Tooltip } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import "./Sidebar.scss";
const SideBar = () => {
  const pathname = usePathname();
  return (
    <aside className="">
      <Tabs
        selectedKey={pathname}
        aria-label="Tabs"
        isVertical={true}
        className="admin-sidebar"
        // radius="none"
      >
        <Tab
          key="/admin"
          id="/admin"
          href="/admin"
          title={
            <Tooltip content="Overview">
              <DashboardIcon />
            </Tooltip>
          }
        />
        <Tab
          key="/admin/product"
          id="/admin/product"
          href="/admin/product"
          title={
            <Tooltip content="Product">
              <StorefrontIcon />
            </Tooltip>
          }
        />
        <Tab
          key="/admin/category"
          id="/admin/category"
          href="/admin/category"
          title={
            <Tooltip content="category & brand">
              <CategoryIcon />
            </Tooltip>
          }
        />
        <Tab
          key="/admin/order"
          id="/admin/order"
          href="/admin/order"
          title={
            <Tooltip content="Order">
              <EditNoteIcon />
            </Tooltip>
          }
        />
      </Tabs>
    </aside>
  );
};

export default SideBar;
