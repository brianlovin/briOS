import { ArrowUpRight } from "@/components/icons/ArrowUpRight";
import {
  List,
  ListItem,
  ListItemLabel,
  ListItemSubLabel,
} from "@/components/shared/ListComponents";

const projects = [
  {
    name: "HN",
    href: "/hn",
    description: "A minimal hacker news reader",
    external: false,
  },
  {
    name: "App Dissection",
    href: "/app-dissection",
    description: "Breaking down well-designed apps",
    external: false,
  },
  {
    name: "Stack",
    href: "/stack",
    description: "My favorite apps and tools",
    external: false,
  },
  {
    name: "AMA",
    href: "/ama",
    description: "Ask me anything",
    external: false,
  },
  {
    name: "TIL",
    href: "/til",
    description: "Today I learned",
    external: false,
  },
  {
    name: "Listening",
    href: "/listening",
    description: "Music in rotation",
    external: false,
  },
  {
    name: "Good websites",
    href: "/sites",
    description: "A curated collection of inspiration",
    external: false,
  },
  {
    name: "Staff Design",
    href: "https://staff.design",
    description: "Interview series about the IC career path",
    external: true,
  },
  {
    name: "Design Details",
    href: "https://designdetails.fm",
    description: "A podcast about design and technology",
    external: true,
  },
  {
    name: "How to Computer Better",
    href: "https://brianlovin.notion.site/how-to-computer-better",
    description: "A living list of tips, shortcuts, and so on",
    external: true,
  },
  {
    name: "Crit",
    href: "https://www.youtube.com/playlist?list=PLJu44Klx1pB_8GSOUeDNDllPICvMJKSut",
    description: "Solicited app redesigns",
    external: true,
  },
  {
    name: "How Terminals Work",
    href: "https://how-terminals-work.vercel.app/",
    description: "A visual guide",
    external: true,
  },
];

interface ProjectsListProps {
  exclude?: string[];
}

export function ProjectsList({ exclude = [] }: ProjectsListProps) {
  const filteredProjects = projects.filter((project) => !exclude.includes(project.name));

  return (
    <List>
      {filteredProjects.map(({ name, href, description, external }) => (
        <ListItem
          key={name}
          href={href}
          className="flex-col items-start gap-0 sm:flex-row sm:items-center sm:gap-2"
        >
          <div className="flex items-center gap-2">
            <ListItemLabel className="sm:line-clamp-1">{name}</ListItemLabel>
            {external && (
              <ListItemSubLabel className="shrink-0 font-mono">
                <ArrowUpRight className="text-primary" />
              </ListItemSubLabel>
            )}
          </div>
          <ListItemSubLabel className="flex-1">{description}</ListItemSubLabel>
        </ListItem>
      ))}
    </List>
  );
}
