import { useState } from "react";

export default function MakeBid({
  bid,
  handleNewBid,
}: {
  bid: number;
  handleNewBid: (newBid: number) => void;
}) {
  const [newBid, setNewBid] = useState<number | null>(null);
  const [actualBid, setActualBid] = useState<number>(bid);

  const handleNewBidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    setNewBid(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleNewBid(newBid as number);
    setActualBid(+newBid!);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <div className="m-2">
        Actual bid:
        <p className="ml-2 text-gray-700 font-semibold text-xl inline-block">
          ${actualBid}
        </p>
      </div>

      <input
        type="number"
        min={bid}
        value={newBid ?? ""} // usar ?? para mostrar una cadena vacía si newBid es nulo
        onChange={handleNewBidChange}
        placeholder={(bid + 1).toString()}
        className="p-3 appearance-none py-2 w-24 leading-tight rounded border-2 border-gray-400 bg-white 
            text-gray-700 focus:outline-none focus:border-blue-500 mr-2"
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 
            px-4 rounded hover:scale-105 transition-all hover:shadow-lg"
      >
        Bid
      </button>
    </form>
  );
}
