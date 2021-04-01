function Digit({ className }) {
  return (
    <div className={`w-24 text-white border border-yellow-200 rounded pb-digit ${className}`}>
      <p>1</p>
    </div>
  );
}

export default function Clock() {
  return (
    <div className="relative w-3/4 overflow-hidden bg-gray-700 pb-clock">
      <div className="absolute w-full h-full">
        <div className="flex justify-end mt-6 mr-20">
          <Digit className="mr-2" />
          <Digit className="mx-2" />
          <Digit className="mx-2" />
          <Digit className="mx-2" />
          <Digit className="mx-2" />
          <Digit className="mx-2" />
          <Digit className="ml-2" />
        </div>
      </div>
    </div>
  );
}
