const CardDetails = ({ balance }) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-2xl text-white shadow-md pt-10 pb-10">
      <p className="text-lg font-bold">ACCOUNT BALANCE</p>
      <p className="text-3xl font-bold">₹{balance.toFixed(2)}</p>
      <div className="flex flex-col pt-5">
        <button className="bg-white text-purple-600 mt-4 px-4 py-2 rounded">Manage </button>
      </div>
    </div>
  );
};

export default CardDetails;