import Link from 'next/link'

function Test() {
    return (
    <>
        <h1>First Post</h1>
        <h2>
            <Link href="/"> 
            <a>TAKE ME HOME!</a>
            </Link>
        </h2>
    </>
    );
  }

  export default Test