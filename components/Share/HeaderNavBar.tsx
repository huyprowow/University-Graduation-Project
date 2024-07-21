"use client";
import { useBrand } from "@/hook/brand";
import { useCategory } from "@/hook/category";
import { useProduct } from "@/hook/product";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link
} from "@nextui-org/react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import Logo from "../../public/logo.png";
import { SearchIcon } from "../Icons/SearchIcon";

const HeaderNavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { search, setSearch } = useProduct();
  const { currentCategory } = useCategory();
  const { currentBrand } = useBrand();
  const { query } = search;
  const router = useRouter();

  const { data: session } = useSession();
  const menuItems = [
    { name: "Product", path: "product?search=&category=&brand=" },
  ];
  const onChangeSearch = (e) => {
    console.log(e.target.value);
    setSearch({
      ...search,
      query: e.target.value,
    });
    router.push(
      `/product?search=${e.target.value}&category=${
        currentCategory._id ? currentCategory._id : ""
      }&brand=${currentBrand._id ? currentBrand._id : ""}`
    );
  };
  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
        <Link color="foreground" href="/">
          <NavbarBrand>
            <Image
              src={Logo}
              alt="Logo"
              priority
              width={32}
              height={32}
              style={{ paddingTop: 2 }}
            />
            <p className="font-bold text-inherit ">IA Store</p>
          </NavbarBrand>
        </Link>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <Link color="foreground" href="/">
          <NavbarBrand>
            <Image
              src={Logo}
              alt="Logo"
              priority
              width={32}
              height={32}
              style={{ paddingTop: 2 }}
            />
            <p className="font-bold text-inherit ">IA Store</p>
          </NavbarBrand>
        </Link>
        {menuItems?.map((item, idx) => (
          <NavbarItem key={idx}>
            <Link color="foreground" href={`/${item.path}`} >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[100rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          value={query}
          placeholder="Type to search..."
          size="sm"
          startContent={<SearchIcon size={18} />}
          type="search"
          onChange={onChangeSearch}
        />
        {session ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src={session?.user?.image ?? ""}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{session.user?.email}</p>
              </DropdownItem>
              {(session as any)?.user?.role === "admin" ? (
                <DropdownItem key="admin">
                  <Link
                    className="m-0 block h-full w-full"
                    color="foreground"
                    href="/admin"
                  >
                    Admin
                  </Link>
                </DropdownItem>
              ) : null}
              <DropdownItem key="order">
                <Link
                  className="m-0 block h-full w-full"
                  color="foreground"
                  href="/order"
                >
                  My Order
                </Link>
              </DropdownItem>

              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem key="team_settings">Team Settings</DropdownItem>
              <DropdownItem key="analytics">Analytics</DropdownItem>
              <DropdownItem key="system">System</DropdownItem>
              <DropdownItem key="configurations">Configurations</DropdownItem>
              <DropdownItem key="help_and_feedback">
                Help & Feedback
              </DropdownItem>
              <DropdownItem
                key="logout"
                onPress={() => signOut()}
                color="danger"
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <NavbarItem>
            <Button
              as={Link}
              onPress={() =>
                signIn("google", {
                  callbackUrl: window.location.origin,
                })
              }
              variant="flat"
            >
              Access
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarMenu>
        {menuItems?.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link className="w-full" href={`/${item.path}`} size="lg">
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default HeaderNavBar;
