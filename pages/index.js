import Head from "next/head";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

export default function Home() {
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
    const apiData =
      !isLoading && !error
        ? ((1 / parseInt(data.bpi.USD.rate.replace(",", ""))) * 100000000)
            .toFixed(2)
            .toString()
            .replace(".", "")
        : undefined;

    const displayData = apiData
      ? [
          apiData.slice(0, apiData.length - 4),
          ":",
          apiData.slice(apiData.length - 4, apiData.length - 2),
          ":",
          apiData.slice(apiData.length - 2),
        ].join("")
      : undefined;

    setSatsPerDollar(displayData);
  }, [data]);

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <Head>
        <link rel="shortcut icon" href="/bitcoin.svg" />
        <title>Moscow Time</title>
      </Head>
      <div className="flex flex-col items-center justify-center h-screen lg:flex-row">
        <p className="font-semibold text-7xl">It's</p>
        <p className="mt-10 font-bold lg:ml-10 lg:mt-0 text-9xl">
          {satsPerDollar}
        </p>
        <p className="mt-10 font-semibold lg:mt-0 text-7xl lg:ml-10">
          in Moscow
        </p>
      </div>
    </div>
  );
}
