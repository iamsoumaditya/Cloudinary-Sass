"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SignedIn,SignedOut} from "@clerk/nextjs";
import Link from "next/link";

export default function Footer() {
  const pathname = usePathname();
  const [isgap, setIsGap] = useState<boolean>(false);

  useEffect(() => {
    function isGapNeededForFooter(pathname: string): boolean {
      if (
        pathname.includes("home") ||
        pathname.includes("social-share") ||
        pathname.includes("video-upload") ||
        pathname.includes("studio")
      )
        return true;
      else return false;
    }
    setIsGap(isGapNeededForFooter(pathname));
  }, [pathname]);

  return (
    <>
      <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-10">
        <nav>
          <h6 className="footer-title">Services</h6>
          <Link href={"#"} className="link link-hover">Smart AI Video Processing</Link>
          <Link href={"#"} className="link link-hover">Social Media Ready Images</Link>
          <Link href={"#"} className="link link-hover">Powerful Editing Studio</Link>
          <Link href={"#"} className="link link-hover">Unified Media Workspace</Link>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <Link href={"#"} className="link link-hover">Home</Link>
          <Link href={"#"} className="link link-hover">About Us</Link>
          <Link href={"#"} className="link link-hover">Learn More</Link>
          <Link href={"#"} className="link link-hover">Contact Us</Link>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <Link href={"#"} className="link link-hover">Terms of use</Link>
          <Link href={"#"} className="link link-hover">Privacy policy</Link>
        </nav>
        <nav>
          <h6 className="footer-title">More</h6>
          <Link href={"#"} className="link link-hover">Raise a complaint</Link>
        </nav>
      </footer>
      <footer
        className={`footer flex flex-row justify-between bg-base-200 text-base-content border-base-300 border-t px-10 py-4 ${isgap ? "mb-14" : ""}`}
      >
        <aside className="grid-flow-col items-center">
          <p>
            <SignedIn>
              <Link href={"/home"} className="hover:underline">
                MediaRefine
              </Link>
            </SignedIn>
            <SignedOut>
              <Link href={"/"} className="hover:underline">
                MediaRefine
              </Link>
            </SignedOut>
            <br />
            Providing reliable tech since 2026
          </p>
        </aside>
        <nav className="justify-self-end">
          <div className="grid grid-flow-col gap-4">
            <a
              href="https://github.com/iamsoumaditya/Cloudinary-Sass"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80 transition-opacity duration-300 hover:opacity-100"
            >
              <FaGithub className="size-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/soumaditya-roy/"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80 transition-opacity duration-300 hover:opacity-100"
            >
              <FaLinkedin className="size-5" />
            </a>
            <a
              href="https://x.com/iamsoumaditya"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80 transition-opacity duration-300 hover:opacity-100"
            >
              <FaXTwitter className="size-5" />
            </a>
            <a
              href="https://www.instagram.com/iamsoumaditya/"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80 transition-opacity duration-300 hover:opacity-100"
            >
              <FaInstagram className="size-5" />
            </a>
          </div>
        </nav>
      </footer>
    </>
  );
}
