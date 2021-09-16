import * as React from 'react'
import StaffDesign from './StaffDesign'
import SideProjects from './SideProjects'
import DesignDetails from './DesignDetails'
import FigmaPlugins from './FigmaPlugins'
import OpenSource from './OpenSource'
import Writing from './Writing'

function ProjectsList({ episodes, posts }) {
  return (
    <div className="space-y-16">
      <SideProjects />
      <Writing posts={posts} />
      <StaffDesign />
      <DesignDetails episodes={episodes} />
      <FigmaPlugins />
      <OpenSource />
    </div>
  )
}

export default ProjectsList
