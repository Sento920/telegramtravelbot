import Link from 'next/link'

export default function Header() {
  return (
    <h2>
      <Link href="/">
        <a className="hover:underline">Home</a>
      </Link>
      .
    </h2>
  )
}