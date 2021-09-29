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
import { AddBookmarkDialog } from '../Bookmarks/AddBookmarkDialog'
import { Plus } from 'react-feather'
import { UserRole, useViewerQuery } from '~/graphql/types.generated'

function ThisAddBookmarkDialog() {
  return (
    <AddBookmarkDialog>
      <div className="flex items-center justify-center p-2.5 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
        <Plus size={16} className="text-primary" />
      </div>
    </AddBookmarkDialog>
  )
}

export function SidebarNavigation() {
  const router = useRouter()
  const { data } = useViewerQuery()

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
      trailingAction:
        data?.viewer?.role === UserRole.Admin ? ThisAddBookmarkDialog : null,
    },

    {
      href: '/ama',
      label: 'AMA',
      icon: AMAIcon,
      trailingAccessory: null,
      isActive: router.asPath.indexOf('/ama') >= 0,
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
      href: '/staff-design',
      label: 'Staff Design',
      icon: StaffDesignIcon,
      trailingAccessory: null,
      isActive: router.asPath.indexOf('/staff-design') >= 0,
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
      href: '/app-dissection',
      label: 'App Dissection',
      icon: AppDissectionIcon,
      trailingAccessory: null,
      isActive: router.asPath.indexOf('/app-dissection') >= 0,
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
            trailingAccessory={link.trailingAccessory}
            isActive={link.isActive}
            trailingAction={link.trailingAction}
          />
        )
      })}
    </ul>
  )
}
