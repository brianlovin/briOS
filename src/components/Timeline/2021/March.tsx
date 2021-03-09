import Link from 'next/link'
import * as React from 'react'
import Image from 'next/image'
import {
  GitCommit,
  GitMerge,
  Zap,
  Wind,
  Twitter,
  Camera,
  Plus,
  Layers,
} from 'react-feather'
import { BlogPost } from '../BlogPost'
import { ButtonSet, DateEntry, Notes, TimelineEntry } from '../Entry'

export function March() {
  return (
    <>
      <DateEntry title="March, 2021" />
      <TimelineEntry
        title="Maps4Resources beta release!"
        timestamp="March 9, 2021"
        Icon={Zap}
        tint="red"
        divider={false}
      >
        <>
          <Notes>
            <p>
              I am excited to share the Maps4Resources betaware. The purpose of
              this release it to provide demonstrations and previews to
              prospective stakeholders in{' '}
              <a
                href="https://tec.mx/en"
                target="_blank"
                rel="noopener noreferrer"
              >
                Tecnológico de Monterrey
              </a>{' '}
              and{' '}
              <a
                href="https://www.usfq.edu.ec/en"
                target="_blank"
                rel="noopener noreferrer"
              >
                Universidad San Francisco de Quito
              </a>
              .
            </p>
            <p>
              The application is currently deployed in a hybrid cloud
              environment on GCP and Heroku Cloud Platform. All users should
              note that this software is likely to contain a number of known or
              unknown bugs. Kindly submit any feedback on bugs, or performance
              issues to the linked public repository.
            </p>
          </Notes>
          <ButtonSet>
            <a
              href="https://aif-mvp.herokuapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              Try the Beta!
            </a>
            <a
              href="https://github.com/paulowe/maps4resources/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              File an issue
            </a>
          </ButtonSet>
        </>
      </TimelineEntry>
    </>
  )
}
