import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

function HeroBanner() {
  return (
    <section>
      <Image className="rounded-full" src="/samurai1.png" alt="" width={300} height={300} />
    </section>
  );
}

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>PICME</title>
        <meta name="description" content="Profile picture generator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <HeroBanner />
      </main>
    </>
  );
};

export default HomePage;
