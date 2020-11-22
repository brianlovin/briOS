import * as React from 'react'
import { Ama, useAddAmaReactionMutation } from '~/graphql/types.generated'

interface Props {
  question: Ama
}

export default function QuestionReaction(props: Props) {
  const { question } = props

  const [addReaction] = useAddAmaReactionMutation()

  function handleReaction() {
    return addReaction({
      variables: {
        id: question.id,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        addAMAReaction: {
          __typename: 'AMA',
          ...question,
          reactions: question.reactions + 1,
        },
      },
    })
  }

  return (
    <button
      className="flex space-x-2 items-center focus:ring-opacity-0"
      onClick={handleReaction}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        width="12"
        height="12"
      >
        {' '}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          className={`fill-current ${
            question.reactions > 0
              ? 'text-red-500'
              : 'text-gray-400 dark:text-gray-600'
          }`}
          d="M7.655 14.9159C7.65523 14.9161 7.65543 14.9162 8 14.25C8.34457 14.9162 8.34477 14.9161 8.34501 14.9159C8.12889 15.0277 7.87111 15.0277 7.655 14.9159ZM7.655 14.9159L8 14.25L8.34501 14.9159L8.34731 14.9147L8.35269 14.9119L8.37117 14.9022C8.38687 14.8939 8.40926 14.882 8.4379 14.8665C8.49516 14.8356 8.57746 14.7904 8.6812 14.7317C8.8886 14.6142 9.18229 14.442 9.53358 14.2199C10.2346 13.7767 11.1728 13.13 12.1147 12.3181C13.9554 10.7312 16 8.35031 16 5.5C16 2.83579 13.9142 1 11.75 1C10.2026 1 8.84711 1.80151 8 3.01995C7.15289 1.80151 5.79736 1 4.25 1C2.08579 1 0 2.83579 0 5.5C0 8.35031 2.04459 10.7312 3.8853 12.3181C4.82717 13.13 5.76538 13.7767 6.46642 14.2199C6.81771 14.442 7.1114 14.6142 7.3188 14.7317C7.42254 14.7904 7.50484 14.8356 7.5621 14.8665C7.59074 14.882 7.61313 14.8939 7.62883 14.9022L7.64731 14.9119L7.65269 14.9147L7.655 14.9159Z"
        ></path>
      </svg>
      <span className="p-small">{question.reactions.toLocaleString()}</span>
    </button>
  )
}
