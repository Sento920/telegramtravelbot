import Head from 'next/head'
import 'tailwindcss/tailwind.css'
import Link from 'next/link'

function HomePage() {
    return( 
    <div>
        <div>Welcome to Next.js!</div>
        <Link href="test/test">
            <a>Link thinger</a>
        </Link>);
    </div>
    );
}

    export default HomePage