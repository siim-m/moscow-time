function Digit({ digit }) {
  return (
    <div
      className={`relative rounded-lg`}
      style={{ width: "11.675%" }}
    >
      <div className="absolute flex items-center justify-center w-full h-full text-7xl">
        {!isNaN(parseInt(digit)) && <p className="font-semibold text-gray-200 sm:pb-1 md:pb-2 lg:pb-3" style={{fontSize: "13.5vw", fontFamily: 'Steelfish Rounded Bold' }}>{digit}</p>}
        {isNaN(parseInt(digit)) && digit == "S" && (
          <div className="font-semibold leading-tight text-center text-gray-200" style={{ fontFamily: 'Steelfish Rounded Bold'}}>
            <p style={{fontSize: "2.5vw"}}>MOSCOW</p>
            <hr className="border border-gray-200" />
            <p style={{fontSize: "2.5vw"}}>TIME</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Digits({ digits = ["0", "0", "0", "0", "0", "0", "0"] }) {
  return (
    <div
      className="flex justify-between"
      style={{
        width: "84.55%",
        height: "57.5%",
        marginLeft: "7.8%",
        marginTop: "3.2%",
      }}
    >
      <Digit digit={digits[0]} />
      <Digit digit={digits[1]} />
      <Digit digit={digits[2]} />
      <Digit digit={digits[3]} />
      <Digit digit={digits[4]} />
      <Digit digit={digits[5]} />
      <Digit digit={digits[6]} />
    </div>
  );
}

export default function Clock({ digits }) {
  return (
    <div
      className="relative w-3/4 overflow-hidden bg-contain rounded-md cursor-default pointer-events-none lg:rounded-2xl xl:rounded-3xl 2xl:rounded-4xl md:rounded-xl sm:rounded-lg pb-clock"
      style={{ backgroundImage: `url('/blockclock.jpg')` }}
    >
      <div className="absolute w-full h-full">
        <Digits digits={digits} />
      </div>
    </div>
  );
}
