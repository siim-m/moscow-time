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

  const [activeData, setActiveData] = useState(initialData);
  const [displayArray, setDisplayArray] = useState([]);

  useEffect(() => {
    const usingData = !isLoading && !error ? data : initialData;

    setActiveData(usingData);
  }, [data, initialData]);

  useEffect(() => {
    const satsPerDollarString = activeData
      ? Math.round((1 / activeData.bpi.USD.rate_float) * 100000000).toString()
      : undefined;

    switch (satsPerDollarString.length) {
      case 0:
        setDisplayArray([]);
        break;
      case 1:
        setDisplayArray(["S", "", "", "", "", "", satsPerDollarString[0]]);
        break;
      case 2:
        setDisplayArray([
          "S",
          "",
          "",
          "",
          "",
          satsPerDollarString[0],
          satsPerDollarString[1],
        ]);
        break;
      case 3:
        setDisplayArray([
          "S",
          "",
          "",
          "",
          satsPerDollarString[0],
          satsPerDollarString[1],
          satsPerDollarString[2],
        ]);
        break;
      case 4:
        setDisplayArray([
          "S",
          "",
          "",
          satsPerDollarString[0],
          satsPerDollarString[1],
          satsPerDollarString[2],
          satsPerDollarString[3],
        ]);
        break;
      case 5:
        setDisplayArray([
          "S",
          "",
          satsPerDollarString[0],
          satsPerDollarString[1],
          satsPerDollarString[2],
          satsPerDollarString[3],
          satsPerDollarString[4],
        ]);
        break;
      default:
        setDisplayArray([]);
        break;
    }
  }, []);

  return (
    <div className="h-screen dark:bg-black dark:text-white">
      <Head>
        <link rel="shortcut icon" href="/bitcoin.svg" />
        <title>Moscow Time</title>
      </Head>
      <div className="flex flex-col items-center justify-center h-full">
        <Clock digits={displayArray} />
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
