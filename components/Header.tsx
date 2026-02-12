import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import {auth}from "@clerk/nextjs/server"
import ThemeToogler from "@/components/ThemeToogler";
import SearchInput from "@/components/SearchInput"
import {Button,Modal} from "@/components/Modal";
import HeaderButton from "./HeaderButton";

export default async function Header() {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value ?? "dark";
  const {userId}= await auth()

  return (
    <div className="navbar bg-base-100 shadow-sm text-base-content max-w-screen sticky top-0 z-60">
      <div className="flex-1">
        <SignedIn>
          <Link href={"/home"} className="btn btn-ghost text-xl">
            MediaRefine
          </Link>
        </SignedIn>
        <SignedOut>
          <Link href={"/"} className="btn btn-ghost text-xl">
            MediaRefine
          </Link>
        </SignedOut>
      </div>
      <div className="flex gap-2 items-center">
        <SignedIn>
        <SearchInput />
          <HeaderButton />
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <button className="btn btn-outline btn-sm sm:btn-md rounded-2xl">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="btn btn-primary btn-sm sm:btn-md rounded-2xl">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <UserButton />
            </div>
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link
                  href={`/${userId}/account-settings`}
                  className="justify-between"
                >
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <Button />
              </li>
              <li>
                <SignOutButton>
                  <span>Logout</span>
                </SignOutButton>
              </li>
            </ul>
          </div>
        </SignedIn>
        <ThemeToogler theme={theme as "light" | "dark"} />
      </div>
      <Modal theme={theme as "light" | "dark"} />
    </div>
  );
}
