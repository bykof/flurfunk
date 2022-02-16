import React from 'react'
import Head from 'next/head'

type Props = {
  children: React.ReactNode
}

export function DefaultContainer({ children }: Props) {
  return (
    <>
      <Head>
        <title>Flurfunk</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {children}
    </>
  )
}
