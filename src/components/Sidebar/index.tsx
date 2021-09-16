import * as React from 'react'
import { useRouter } from 'next/router'
import {
  AMAIcon,
  AppDissectionIcon,
  BookmarksIcon,
  ExternalLinkIcon,
  FigmaIcon,
  GitHubIcon,
  HackerNewsIcon,
  HomeIcon,
  NewsletterIcon,
  PodcastIcon,
  SecurityChecklistIcon,
  StackIcon,
  StaffDesignIcon,
  TwitterIcon,
  WritingIcon,
} from '../Icon'
import NavigationLink from './NavigationLink'
import { GlobalNavigationContext } from '../Providers'
import TitleBar from '../ListDetail/TitleBar'
import Image from 'next/image'
import { SmallButton } from '../Button'

export default function Sidebar() {
  const router = useRouter()

  const links = [
    {
      href: '/',
      label: 'Home',
      icon: HomeIcon,
      accesory: null,
      isActive: router.asPath === '/',
    },

    {
      href: '/writing',
      label: 'Writing',
      icon: WritingIcon,
      accesory: null,
      isActive: router.asPath.indexOf('/writing') >= 0,
    },

    {
      href: '/design-details',
      label: 'Podcast',
      icon: PodcastIcon,
      accesory: null,
      isActive: router.asPath.indexOf('/design-details') >= 0,
    },

    {
      href: '/newsletter',
      label: 'Newsletter',
      icon: NewsletterIcon,
      accesory: null,
      isActive: router.asPath === '/newsletter',
    },

    'Me',

    {
      href: '/bookmarks',
      label: 'Bookmarks',
      icon: BookmarksIcon,
      accesory: null,
      isActive: router.asPath.indexOf('/bookmarks') >= 0,
    },

    {
      href: '/ama',
      label: 'AMA',
      icon: AMAIcon,
      accesory: null,
      isActive: router.asPath.indexOf('/ama') >= 0,
    },

    {
      href: '/stack',
      label: 'Stack',
      icon: StackIcon,
      accesory: null,
      isActive: router.asPath.indexOf('/stack') >= 0,
    },

    'Projects',

    {
      href: '/staff-design',
      label: 'Staff Design',
      icon: StaffDesignIcon,
      accesory: null,
      isActive: router.asPath.indexOf('/staff-design') >= 0,
    },

    {
      href: '/security',
      label: 'Security Checklist',
      icon: SecurityChecklistIcon,
      accesory: null,
      isActive: router.asPath.indexOf('/security') >= 0,
    },

    {
      href: '/app-dissection',
      label: 'App Dissection',
      icon: AppDissectionIcon,
      accesory: null,
      isActive: router.asPath.indexOf('/app-dissection') >= 0,
    },

    {
      href: '/hn',
      label: 'Hacker News',
      icon: HackerNewsIcon,
      accesory: null,
      isActive: router.asPath.indexOf('/hn') >= 0,
    },

    'Online',

    {
      href: '/twitter',
      label: 'Twitter',
      icon: TwitterIcon,
      accesory: ExternalLinkIcon,
      isActive: false,
    },

    {
      href: '/github',
      label: 'GitHub',
      icon: GitHubIcon,
      accesory: ExternalLinkIcon,
      isActive: false,
    },

    {
      href: '/figma',
      label: 'Figma',
      icon: FigmaIcon,
      accesory: ExternalLinkIcon,
      isActive: false,
    },
  ]

  const { isOpen, setIsOpen } = React.useContext(GlobalNavigationContext)

  return (
    <>
      <div
        className={`${
          isOpen
            ? 'absolute inset-y-0 left-0 translate-x-0 shadow-lg'
            : 'absolute -translate-x-full'
        } lg:relative flex flex-col lg:translate-x-0 w-64 h-full z-30 max-h-screen min-h-screen overflow-y-auto transition duration-200 ease-in-out transform bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-800`}
      >
        <TitleBar
          leadingAccessory={
            <Image
              src="/static/img/avatar.jpeg"
              width="32"
              height="32"
              layout="fixed"
              className="rounded-full"
            />
          }
          title="Brian Lovin"
        />

        <ul className="flex-1 px-3 py-3 space-y-1">
          {links.map((link, i) => {
            if (typeof link === 'string') {
              return (
                <p
                  key={i}
                  className="px-3 pt-6 pb-2 text-sm font-semibold text-gray-1000 dark:text-white text-opacity-40"
                >
                  {link}
                </p>
              )
            }

            return (
              <NavigationLink
                key={i}
                href={link.href}
                label={link.label}
                icon={link.icon}
                accessory={link.accesory}
                isActive={link.isActive}
              />
            )
          })}
        </ul>

        <div className="sticky bottom-0 z-10 flex items-center px-3 py-2 space-x-3 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800 h-14 bg-opacity-80 filter-blur dark:bg-opacity-60">
          <SmallButton href="/login" className="w-full">
            Sign in
          </SmallButton>
        </div>
      </div>
      <div
        className={`fixed bg-black bg-opacity-5 transition duration-200 ease-in-out inset-0 z-20 ${
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />
    </>
  )
}
