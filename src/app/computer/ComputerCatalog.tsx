import { List, ListItem, ListItemLabel, Section } from "@/components/shared/ListComponents";
import { PageTitle } from "@/components/Typography";
import { COMPUTER_INTRO, COMPUTER_TITLE, type ComputerTip, computerTipLink } from "@/lib/computer";

import { ComputerTipIcon } from "./ComputerTipIcon";

export function ComputerCatalog({ tips }: { tips: ComputerTip[] }) {
  return (
    <div data-scrollable className="flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-xl flex-1 flex-col gap-16 py-16 leading-[1.6]">
        <Section>
          <PageTitle>{COMPUTER_TITLE}</PageTitle>
          <p className="text-secondary text-lg leading-relaxed">{COMPUTER_INTRO}</p>
        </Section>
        <Section>
          <List>
            {tips.map((tip) => {
              const link = computerTipLink(tip);
              if (!link) return null;
              return (
                <ListItem key={tip.id} href={link.href}>
                  <ComputerTipIcon icon={tip.icon} />
                  <ListItemLabel className="line-clamp-none">{tip.title}</ListItemLabel>
                </ListItem>
              );
            })}
          </List>
        </Section>
      </div>
    </div>
  );
}
