import * as React from 'react'
import { useRouter } from 'next/router'
import {
  AMAIcon,
  AppDissectionIcon,
  BookmarksIcon,
  ExternalLinkIcon,
  GitHubIcon,
  HackerNewsIcon,
  HomeIcon,
  PodcastIcon,
  SecurityChecklistIcon,
  StackIcon,
  StaffDesignIcon,
  TwitterIcon,
  WritingIcon,
} from '../Icon'
import NavigationLink from './NavigationLink'

export function SidebarNavigation() {
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
      href: 'https://twitter.com/brian_lovin',
      label: 'Twitter',
      icon: TwitterIcon,
      accesory: ExternalLinkIcon,
      isActive: false,
    },

    {
      href: 'https://github.com/brianlovin',
      label: 'GitHub',
      icon: GitHubIcon,
      accesory: ExternalLinkIcon,
      isActive: false,
    },
  ]

  return (
    <ul className="flex-1 px-3 py-3 space-y-1">
      {links.map((link, i) => {
        if (typeof link === 'string') {
          return (
            <p
              key={i}
              className="px-2 pt-5 pb-2 text-xs font-semibold text-gray-1000 dark:text-white text-opacity-40"
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
  )
}
