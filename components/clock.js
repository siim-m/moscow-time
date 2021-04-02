function Digit({ digit }) {
  return (
    <div
      className={`relative rounded-lg`}
      style={{ width: "11.675%" }}
    >
      <div className="absolute flex items-center justify-center w-full h-full text-7xl">
        {!isNaN(parseInt(digit)) && <p className="pb-3 text-digit" style={{fontSize: "11vw", transform: `scale(1, 1.4`, fontFamily: 'Inconsolata' }}>{digit}</p>}
        {isNaN(parseInt(digit)) && digit == "S" && (
          <div className="font-semibold leading-tight text-center text-digit" style={{ fontFamily: 'Inconsolata'}}>
            <p style={{fontSize: "2vw"}}>MOSCOW</p>
            <hr className="border border-digit" />
            <p style={{fontSize: "2vw"}}>TIME</p>
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
        // marginRight: "12%",
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
      className="relative w-3/4 overflow-hidden bg-gray-700 bg-contain cursor-default pointer-events-none rounded-4xl pb-clock"
      style={{ backgroundImage: `url('/blockclock.jpg')` }}
    >
      <div className="absolute w-full h-full">
        <Digits digits={digits} />
      </div>
    </div>
  );
}
