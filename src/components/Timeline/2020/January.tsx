import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { GitCommit, GitMerge, Zap, Wind, Twitter, Camera } from 'react-feather'
import { ButtonSet, DateEntry, Notes, TimelineEntry } from '../Entry'
import { BlogPost } from '../BlogPost'

export function January() {
  return (
    <>
      <DateEntry title="January, 2020" />
      <TimelineEntry
        title="Social Network Analysis"
        timestamp="January 29, 2020"
        Icon={GitCommit}
      >
        <Notes>
          <p>
            With over 500 million tweets per day, you can imagine how rich with
            information the twitter platform is. I conducted a{' '}
            <a
              href="https://en.wikipedia.org/wiki/Social_network_analysis"
              rel="noopener noreferrer"
            >
              social network analysis
            </a>{' '}
            to understand the structural properties of networks on twitter. I
            used{' '}
            <a
              href="http://docs.tweepy.org/en/latest/"
              rel="noopener noreferrer"
            >
              tweepy
            </a>{' '}
            to test and integrate twitter’s REST and Streaming APIs into my
            application. I modelled twitter conversations and monitored how
            users interact and communicate in an aggregate manner. Finally, I
            created a dynamic map to visualize location of tweets and enhance
            comprehensibility of my analysis{' '}
            <a
              href="https://python-visualization.github.io/folium/"
              rel="noopener noreferrer"
            >
              Folium
            </a>
            .
          </p>
        </Notes>
        <ButtonSet>
          <a
            href="https://towardsdatascience.com/mining-twitter-data-ba4e44e6aecc"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto"
          >
            <button className="w-full md:w-auto btn">
              <>
                <span>Read technical report</span>
              </>
            </button>
          </a>
          <a
            href="https://github.com/paulowe/mining-twitter"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto"
          >
            <button className="w-full md:w-auto btn">
              <>
                <GitMerge size={16} />
                <span>View project on Github</span>
              </>
            </button>
          </a>
        </ButtonSet>
      </TimelineEntry>
    </>
  )
}
