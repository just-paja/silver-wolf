import Error from 'next/error'

export const asStatusCodePage = (Component) =>
  function StatusCodePage({ statusCode, ...props }) {
    return statusCode === 200 ? (
      <Component statusCode={statusCode} {...props} />
    ) : (
      <Error statusCode={statusCode} />
    )
  }
