const PartyDetailCard = ({ party, handlePartyAsBtn, active }) => {
  return (
    <div
      className={`p-2  shadow cursor-pointer flex justify-between items-center hover:scale-[0.98] hover:bg-primaryBlue hover:text-white group ${active && "bg-primaryBlue text-white"}`}
      onClick={() => {
        handlePartyAsBtn(party);
      }}
    >
      <div>
        <p className="font-semibold text-sm">{party.name}</p>
        <div className="pt-1">
          <p className="text-[11px] font-medium text-gray-500 group-hover:text-white">
            Contact No: {party.contactNo}
          </p>
          <p className="text-[11px] font-medium text-gray-500 group-hover:text-white">
            Total Sale: &#8377; 25,000
          </p>
        </div>
      </div>
    </div>
  );
};

export default PartyDetailCard;
