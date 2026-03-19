import React from 'react'
import Link from 'next/link'

const page = () => {
  return (
    <div>
        <h1>ポケモン対戦ゲーム</h1>
        <Link href="/fight">対戦する</Link>
    </div>
  )
}

export default page;