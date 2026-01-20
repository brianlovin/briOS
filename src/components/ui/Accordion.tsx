"use client";

import { Accordion as BaseUIAccordion } from "@base-ui/react/accordion";
import * as React from "react";

import { cn } from "@/lib/utils";

const Accordion = BaseUIAccordion.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof BaseUIAccordion.Item>,
  React.ComponentPropsWithoutRef<typeof BaseUIAccordion.Item>
>(({ className, ...props }, ref) => (
  <BaseUIAccordion.Item ref={ref} className={cn(className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof BaseUIAccordion.Trigger>,
  React.ComponentPropsWithoutRef<typeof BaseUIAccordion.Trigger>
>(({ className, children, ...props }, ref) => (
  <BaseUIAccordion.Header className="flex">
    <BaseUIAccordion.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between [&[data-panel-open]>svg]:rotate-180",
        className,
      )}
      {...props}
    >
      {children}
    </BaseUIAccordion.Trigger>
  </BaseUIAccordion.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof BaseUIAccordion.Panel>,
  React.ComponentPropsWithoutRef<typeof BaseUIAccordion.Panel>
>(({ className, children, ...props }, ref) => (
  <BaseUIAccordion.Panel ref={ref} className={cn("overflow-hidden", className)} {...props}>
    <div className="pt-0 pb-4">{children}</div>
  </BaseUIAccordion.Panel>
));
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
