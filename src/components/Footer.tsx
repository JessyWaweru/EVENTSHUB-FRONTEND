import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-200 text-center text-white dark:bg-neutral-800">
      <div className="pt-9">
        <div className="mb-9 flex justify-center items-center gap-8">
          <a
            href="#!"
            className="text-neutral-600 hover:text-primary transition-colors duration-300 dark:text-neutral-200 dark:hover:text-primary"
            aria-label="Facebook"
          >
            <Facebook size={24} />
          </a>
          <a
            href="#!"
            className="text-neutral-600 hover:text-primary transition-colors duration-300 dark:text-neutral-200 dark:hover:text-primary"
            aria-label="Twitter"
          >
            <Twitter size={24} />
          </a>
          <a
            href="#!"
            className="text-neutral-600 hover:text-primary transition-colors duration-300 dark:text-neutral-200 dark:hover:text-primary"
            aria-label="Instagram"
          >
            <Instagram size={24} />
          </a>
          <a
            href="#!"
            className="text-neutral-600 hover:text-primary transition-colors duration-300 dark:text-neutral-200 dark:hover:text-primary"
            aria-label="LinkedIn"
          >
            <Linkedin size={24} />
          </a>
          <a
            href="#!"
            className="text-neutral-600 hover:text-primary transition-colors duration-300 dark:text-neutral-200 dark:hover:text-primary"
            aria-label="Github"
          >
            <Github size={24} />
          </a>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="bg-neutral-300 p-4 text-center text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
        © {currentYear} Copyright:
        <span className="font-semibold text-neutral-900 dark:text-white ml-1">
          Tamasha
        </span>
      </div>
    </footer>
  );
}