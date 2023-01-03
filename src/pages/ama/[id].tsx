import * as React from 'react'

import { QuestionDetail } from '~/components/AMA/QuestionDetail'
import { QuestionsList } from '~/components/AMA/QuestionsList'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { withProviders } from '~/components/Providers/withProviders'

function QuestionDetailPage({ id }) {
  return <QuestionDetail id={id} />
}

export async function getServerSideProps({ params: { id } }) {
  return {
    props: {
      id,
    },
  }
}

QuestionDetailPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView list={<QuestionsList />} hasDetail detail={page} />
    </SiteLayout>
  )
})

export default QuestionDetailPage
