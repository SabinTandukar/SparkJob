"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  User,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  const [openDropDown, setOpenDropDown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const router = useRouter();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropDown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Logout function
  const handleLogout = () => {
    logout();

    setOpenDropDown(false);
    router.push("/login");
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
            <Briefcase size={20} />
          </div>
          JobPortal
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-slate-300 transition hover:text-white">
            Home
          </Link>
          <Link
            href="/jobs"
            className="text-slate-300 transition hover:text-white"
          >
            Jobs
          </Link>
        </div>

        {/* Not Logged In */}
        {!user ? (
          <>
            <Link
              href="/login"
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"
            >
              <LogIn size={17} />
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium transition hover:bg-blue-500"
            >
              Create Account
            </Link>
          </>
        ) : (
          <div className="relative" ref={dropdownRef}>
            {/* user button */}
            <button
              onClick={() => setOpenDropDown(!openDropDown)}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 transition hover:bg-slate-800"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                <User size={16} />
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium">
                  {user.firstName || user.email}
                </p>

                <p className="text-xs text-slate-400">{user.role}</p>
              </div>

              <ChevronDown
                size={16}
                className={`transition ${openDropDown ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown */}
            {openDropDown && (
              <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-slate-700 bg-slate-900">
                <Link
                  href={
                    user.role === "RECRUITER"
                      ? "/recruiter/dashboard"
                      : "/candidate/dashboard"
                  }
                  onClick={() => setOpenDropDown(false)}
                  className="flex items-center gap-3 px-4  py-3 hover:bg-slate-800"
                >
                  <LayoutDashboard size={17} />
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-red-500/10"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mobile Button */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="md:hidden"
        >
          {mobileMenu ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="border-t border-slate-800 bg-slate-450 py-5 md:hidden">
          <div className="flex flex-col gap-8 text-center p-8">
            <Link
              href="/"
              onClick={() => setMobileMenu(false)}
              className="text-slate-300"
            >
              Home
            </Link>
            <Link
              href="/jobs"
              onClick={() => setMobileMenu(false)}
              className="text-slate-300"
            >
              Find Jobs
            </Link>

            {!user && (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenu(false)}
                  className="text-slate-300"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMobileMenu(false)}
                  className="text-slate-300"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
