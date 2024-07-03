import { Html, Head, Main, NextScript } from 'next/document'
import Meta from '@/components/layouts/Meta'

export default function Document() {
	return (
		<Html lang="en">
			<Meta
				title="Toolbird"
				description="The all-in-one toolbox for your tech startup"
			/>
			<Head>
				<link
					href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Sora:wght@100..800&display=swap"
					rel="stylesheet"
				></link>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
