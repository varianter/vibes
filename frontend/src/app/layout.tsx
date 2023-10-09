import Head from 'next/head';
import AppProviders from '../components/AppProviders';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <Head>
                <title>Vibes Frontend</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>
            <body>
                <AppProviders> {children}</AppProviders>
            </body>
        </html>
    );

}


