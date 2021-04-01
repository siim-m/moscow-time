function Digit({ className, digit }) {
  return (
    <div
      className={`relative w-1/12 text-white border border-yellow-200 rounded pb-digit ${className}`}
    >
      <div className="absolute flex items-center justify-center w-full h-full text-9xl">
        <p>{digit}</p>
      </div>
    </div>
  );
}

function Digits({ digits = ["0", "0", "0", "0", "0", "0", "0"] }) {
  return (
    <div className="flex justify-end mt-6 mr-20">
      <Digit className="mr-2" digit={digits[0]} />
      <Digit className="mx-2" digit={digits[1]} />
      <Digit className="mx-2" digit={digits[2]} />
      <Digit className="mx-2" digit={digits[3]} />
      <Digit className="mx-2" digit={digits[4]} />
      <Digit className="mx-2" digit={digits[5]} />
      <Digit className="ml-2" digit={digits[6]} />
    </div>
  );
}

export default function Clock({ digits }) {
  return (
    <div className="relative w-3/4 overflow-hidden bg-gray-700 pb-clock">
      <div className="absolute w-full h-full">
        <Digits digits={digits} />
      </div>
    </div>
  );
}
