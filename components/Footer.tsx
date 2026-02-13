"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { slugify } from "@/utils/slugify";

export default function Footer() {
  const pathname = usePathname();
  const [isgap, setIsGap] = useState<boolean>(false);
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false);

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

  const handleSubscribe = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    if (!email) {
      toast.error("Email is required to subscribe");
    }
    setIsSubscribing(true)
    try {
      await axios.post("/api/subscribe", { email });
      toast.success("Subscribed to our newsletter successfully");
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message || "Failed to subscribe");
      }
    } finally {
      e.target.reset()
      setIsSubscribing(false)
    }
  };

  return (
    <>
      <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-10 justify-between max-w-screen">
        <nav>
          <h6 className="footer-title">Services</h6>
          <Link
            href={`/about-us#${slugify("Smart AI Video Processing")}`}
            className="link link-hover"
          >
            Smart AI Video Processing
          </Link>
          <Link
            href={`/about-us#${slugify("Social Media Ready Images")}`}
            className="link link-hover"
          >
            Social Media Ready Images
          </Link>
          <Link
            href={`/about-us#${slugify("Powerful Editing Studio")}`}
            className="link link-hover"
          >
            Powerful Editing Studio
          </Link>
          <Link
            href={`/about-us#${slugify("Unified Media Workspace")}`}
            className="link link-hover"
          >
            Unified Media Workspace
          </Link>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <Link href={"/home"} className="link link-hover">
            Home
          </Link>
          <Link href={"/about-us"} className="link link-hover">
            About Us
          </Link>
          <Link href={"/learn-more"} className="link link-hover">
            Learn More
          </Link>
          <Link href={"/contact-us"} className="link link-hover">
            Contact Us
          </Link>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <Link href={"/terms-of-use"} className="link link-hover">
            Terms of use
          </Link>
          <Link href={"/privacy-policy"} className="link link-hover">
            Privacy policy
          </Link>
          <Link href={"/acknowledgement"} className="link link-hover">
            Acknowledgement
          </Link>
        </nav>
        <nav>
          <h6 className="footer-title">More</h6>
          <Link href={"/faq"} className="link link-hover">
            FAQ Page
          </Link>
          <Link href={"/complaint"} className="link link-hover">
            Raise a complaint
          </Link>
        </nav>
        <nav>
          <h6 className="footer-title">Subscribe to our Newsletter</h6>
          <form className="join" onSubmit={handleSubscribe}>
            <input
              name="email"
              className="input join-item outline-0"
              type="email"
              required
              placeholder="Email"
            />
            <button
              className="btn btn-dash join-item rounded-r-full"
              type="submit"
              disabled={isSubscribing}
            >
              {!isSubscribing ? "Subscribe" : "Subscribing"}
            </button>
          </form>
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
              aria-label="github profile link"
              href="https://github.com/iamsoumaditya/Cloudinary-Sass"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80 transition-opacity duration-300 hover:opacity-100"
            >
              <FaGithub className="size-5" />
            </a>
            <a
              aria-label="linkrdin profile link"
              href="https://www.linkedin.com/in/soumaditya-roy/"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80 transition-opacity duration-300 hover:opacity-100"
            >
              <FaLinkedin className="size-5" />
            </a>
            <a
              aria-label="x profile link"
              href="https://x.com/iamsoumaditya"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80 transition-opacity duration-300 hover:opacity-100"
            >
              <FaXTwitter className="size-5" />
            </a>
            <a
              aria-label="instagram profile link"
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
