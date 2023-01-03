import { Toaster } from 'react-hot-toast'

export function Toast() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Define default options
        className: 'bg-white dark:bg-gray-700 text-primary',
        duration: 2000,
        success: {
          duration: 2000,
          iconTheme: {
            primary: 'green',
            secondary: 'black',
          },
        },
        error: {
          duration: 2000,
          iconTheme: {
            primary: 'red',
            secondary: 'white',
          },
        },
      }}
    />
  )
}
