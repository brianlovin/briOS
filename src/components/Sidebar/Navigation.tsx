import { useRouter } from 'next/router'
import * as React from 'react'
import { Plus } from 'react-feather'

import { AddBookmarkDialog } from '~/components/Bookmarks/AddBookmarkDialog'
import { GhostButton } from '~/components/Button'
import {
  AMAIcon,
  AppDissectionIcon,
  BookmarksIcon,
  ExternalLinkIcon,
  FigmaIcon,
  GitHubIcon,
  HackerNewsIcon,
  HomeIcon,
  PodcastIcon,
  SecurityChecklistIcon,
  StackIcon,
  StaffDesignIcon,
  TwitterIcon,
  WritingIcon,
} from '~/components/Icon'
import { UserRole, useViewerQuery } from '~/graphql/types.generated'

import { NavigationLink } from './NavigationLink'

function ThisAddBookmarkDialog() {
  return (
    <AddBookmarkDialog
      trigger={
        <GhostButton size="small-square">
          <Plus size={16} />
        </GhostButton>
      }
    />
  )
}

export function SidebarNavigation() {
  const router = useRouter()
  const { data } = useViewerQuery()
  const isAdmin = data?.viewer?.role === UserRole.Admin
  const links = [
    {
      href: '/',
      label: 'Home',
      icon: HomeIcon,
      trailingAccessory: null,
      isActive: router.asPath === '/',
      trailingAction: null,
    },

    {
      href: '/writing',
      label: 'Writing',
      icon: WritingIcon,
      trailingAccessory: null,
      isActive: router.asPath.indexOf('/writing') >= 0,
      trailingAction: null,
    },

    'Me',

    {
      href: '/bookmarks',
      label: 'Bookmarks',
      icon: BookmarksIcon,
      trailingAccessory: null,
      isActive: router.asPath.indexOf('/bookmarks') >= 0,
      trailingAction: isAdmin ? ThisAddBookmarkDialog : null,
    },

    {
      href: '/ama',
      label: 'AMA',
      icon: AMAIcon,
      trailingAccessory: null,
      isActive:
        router.asPath.indexOf('/ama') >= 0 &&
        !router.asPath.startsWith('/ama/pending'),
      trailingAction: null,
    },

    {
      href: '/stack',
      label: 'Stack',
      icon: StackIcon,
      trailingAccessory: null,
      isActive: router.asPath.indexOf('/stack') >= 0,
      trailingAction: null,
    },

    'Projects',

    {
      href: 'https://designdetails.fm',
      label: 'Design Details',
      icon: PodcastIcon,
      trailingAccessory: ExternalLinkIcon,
      isActive: false,
      trailingAction: null,
    },

    {
      href: 'https://staff.design',
      label: 'Staff Design',
      icon: StaffDesignIcon,
      trailingAccessory: ExternalLinkIcon,
      isActive: false,
      trailingAction: null,
    },

    {
      href: 'https://figma.com/@brian',
      label: 'Figma Plugins',
      icon: FigmaIcon,
      trailingAccessory: ExternalLinkIcon,
      isActive: false,
      trailingAction: null,
    },

    {
      href: '/security',
      label: 'Security Checklist',
      icon: SecurityChecklistIcon,
      trailingAccessory: null,
      isActive: router.asPath.indexOf('/security') >= 0,
      trailingAction: null,
    },

    {
      href: '/hn',
      label: 'Hacker News',
      icon: HackerNewsIcon,
      trailingAccessory: null,
      isActive: router.asPath.indexOf('/hn') >= 0,
      trailingAction: null,
    },

    {
      href: '/app-dissection',
      label: 'App Dissection',
      icon: AppDissectionIcon,
      trailingAccessory: null,
      isActive: router.asPath.indexOf('/app-dissection') >= 0,
      trailingAction: null,
    },

    'Online',

    {
      href: 'https://twitter.com/brian_lovin',
      label: 'Twitter',
      icon: TwitterIcon,
      trailingAccessory: ExternalLinkIcon,
      isActive: false,
      trailingAction: null,
    },

    {
      href: 'https://github.com/brianlovin',
      label: 'GitHub',
      icon: GitHubIcon,
      trailingAccessory: ExternalLinkIcon,
      isActive: false,
      trailingAction: null,
    },
  ]

  return (
    <ul className="flex-1 px-3 py-3 space-y-1">
      {links.map((link, i) => {
        if (typeof link === 'string') {
          return (
            <li
              key={i}
              className="px-2 pt-5 pb-2 text-xs font-semibold text-gray-1000 dark:text-white text-opacity-40"
            >
              {link}
            </li>
          )
        }

        return (
          <NavigationLink
            key={i}
            href={link.href}
            label={link.label}
            icon={link.icon}
            trailingAccessory={link.trailingAccessory}
            isActive={link.isActive}
            trailingAction={link.trailingAction}
          />
        )
      })}
    </ul>
  )
}
