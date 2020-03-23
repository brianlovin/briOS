import * as React from "react";
import Link from "next/link";
import { ContentContainer, SectionHeading } from "~/components/Page";
import { H1, Larr, Subheading, A } from "~/components/Typography";

export default function NotFound() {
  return (
    <ContentContainer data-cy="overthought-not-found">
      <SectionHeading>
        <H1 style={{ marginTop: 0 }}>Post not Found</H1>

        <Link href="/overthought" passHref>
          <A>
            <Subheading style={{ marginTop: 0 }}>
              <Larr /> Back to Overthought
            </Subheading>
          </A>
        </Link>
      </SectionHeading>
    </ContentContainer>
  );
}
