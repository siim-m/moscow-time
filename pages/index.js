import Head from "next/head";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Clock from "../components/clock";

export default function Home({ initialData }) {
  const { isLoading, error, data } = useQuery(
    "data",
    () =>
      fetch("https://api.coindesk.com/v1/bpi/currentprice.json").then((res) =>
        res.json()
      ),
    {
      refetchInterval: 30000,
    }
  );

  const [satsPerDollar, setSatsPerDollar] = useState();

  useEffect(() => {
    const timeData = !isLoading && !error ? data : initialData;

    const moscowTime = timeData
      ? ((1 / timeData.bpi.USD.rate_float) * 100000000)
          .toFixed(2)
          .toString()
          .replace(".", "")
      : undefined;

    const displayData = moscowTime
      ? [
          moscowTime.slice(0, moscowTime.length - 4),
          ":",
          moscowTime.slice(moscowTime.length - 4, moscowTime.length - 2),
          ":",
          moscowTime.slice(moscowTime.length - 2),
        ].join("")
      : undefined;

    setSatsPerDollar(displayData);
  }, [data, initialData]);

  return (
    <div className="h-screen dark:bg-black dark:text-white">
      <Head>
        <link rel="shortcut icon" href="/bitcoin.svg" />
        <title>Moscow Time</title>
      </Head>
      <div className="flex flex-col items-center justify-center h-full">
        <p className="font-semibold text-7xl">It's</p>
        <p className="mt-10 font-bold text-9xl">{satsPerDollar}</p>
        <p className="mt-10 font-semibold text-7xl ">in Moscow</p>
        <Clock />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const initialData = await (
    await fetch("https://api.coindesk.com/v1/bpi/currentprice.json")
  ).json();

  return {
    props: {
      initialData,
    },
  };
}
