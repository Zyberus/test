import '@/styles/globals.scss';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
var Header = dynamic(function () { return import('@/components/Header'); }, { ssr: true });
var inter = Inter({ subsets: ['latin'] });
export var metadata = {
    title: 'App-Nest - Web Development Excellence',
    description: 'Crafting Digital Experiences with Modern Web Development',
};
export default function RootLayout(_a) {
    var children = _a.children;
    return (<html lang="en" className="dark">
      <body className={"".concat(inter.className, " min-h-screen bg-[var(--primary)] text-[var(--text-primary)]")}>
        <Header />
        {children}
      </body>
    </html>);
}
