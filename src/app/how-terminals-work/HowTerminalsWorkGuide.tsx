"use client";

import { Section, SectionHeading } from "@/components/shared/ListComponents";
import {
  HOW_TERMINALS_WORK_SECTIONS,
  type HowTerminalsWorkSection,
} from "@/lib/how-terminals-work";

import { AdvancedTUIDemo } from "./demos/AdvancedTUIDemo";
import { AlternateScreenDemo } from "./demos/AlternateScreenDemo";
import { CapabilityDiscoveryDemo } from "./demos/CapabilityDiscoveryDemo";
import { CellZoom } from "./demos/CellZoom";
import { EscapeDemo } from "./demos/EscapeDemo";
import { FlowDiagram } from "./demos/FlowDiagram";
import { GridDemo } from "./demos/GridDemo";
import { IconsDemo } from "./demos/IconsDemo";
import { InputModesDemo } from "./demos/InputModesDemo";
import { KeyboardDemo } from "./demos/KeyboardDemo";
import { MouseDemo } from "./demos/MouseDemo";
import { SignalsDemo } from "./demos/SignalsDemo";
import { StateManagementDemo } from "./demos/StateManagementDemo";
import { TextSelectionDemo } from "./demos/TextSelectionDemo";
import { VocabularyDemo } from "./demos/VocabularyDemo";

function DemoForSection({ id }: { id: HowTerminalsWorkSection["id"] }) {
  switch (id) {
    case "grid":
      return <GridDemo />;
    case "cell":
      return <CellZoom />;
    case "escape":
      return <EscapeDemo />;
    case "input":
      return (
        <div className="flex flex-col gap-10">
          <KeyboardDemo />
          <MouseDemo />
        </div>
      );
    case "signals":
      return <SignalsDemo />;
    case "input-modes":
      return <InputModesDemo />;
    case "flow":
      return <FlowDiagram />;
    case "advanced-tui":
      return <AdvancedTUIDemo />;
    case "alternate-screen":
      return <AlternateScreenDemo />;
    case "icons":
      return <IconsDemo />;
    case "state":
      return <StateManagementDemo />;
    case "selection":
      return <TextSelectionDemo />;
    case "capability-discovery":
      return <CapabilityDiscoveryDemo />;
    case "vocabulary":
      return <VocabularyDemo />;
  }
}

export function HowTerminalsWorkGuide() {
  return (
    <>
      {HOW_TERMINALS_WORK_SECTIONS.map((section) => (
        <div key={section.id} id={section.id} className="scroll-mt-8">
          <Section>
            <SectionHeading>
              <span className="tabular-nums">{String(section.number).padStart(2, "0")}</span>{" "}
              {section.title}
            </SectionHeading>
            <p className="text-secondary text-pretty">{section.insight}</p>
            <DemoForSection id={section.id} />
          </Section>
        </div>
      ))}
    </>
  );
}
