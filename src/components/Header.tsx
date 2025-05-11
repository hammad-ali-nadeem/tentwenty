'use client'

import { useState } from 'react'
import Link from 'next/link'

const navItems = ['Home', 'About', 'Services', 'Portfolio', 'Blog'] // Example nav items

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      <header className="bg-white shadow-sm w-[97%] absolute top-4 left-2 md:left-4 z-50">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4 py-3">
          

          {/* Desktop navigation */}
          <nav className="hidden md:flex gap-6 text-sm text-gray-700">
            {navItems.map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="hover:text-black transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>

          <Link href="#contact">
            <button className="flex items-center gap-2 border border-black px-4 py-1 text-sm font-medium hover:bg-black hover:text-white transition-all">
              Contact us
              <span className="inline-block text-lg">→</span>
            </button>
          </Link>
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-black focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={toggleMenu}
      ></div>

      {/* Mobile menu sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="flex flex-col p-4 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-gray-700 hover:text-black transition-colors py-2 px-3 rounded hover:bg-gray-100"
              onClick={toggleMenu}
            >
              {item}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}