import biman from "@/public/images/biman-bd.png";
import arrowRight from "@/public/icons/arrow-right.svg"; // Import missing icon
import right from "@/public/icons/right.svg"; // Import missing icon
import Image from "next/image";

const card = ({
  flight,
  segment,
  fare,
  index,
  openDetailsIndex,
  toggleDetails,
  openRefundableIndex,
  toggleRefundable,
}) => {
  return (
    <div className="space-y-8">
      <div className="max-w-[1000px] bg-white relative rounded-2xl shadow-md">
        {/* Best Deal Badge */}
        <div className="absolute left-[-12px] top-3 bg-[url('/images/badge.png')] bg-no-repeat bg-contain w-28 h-10 flex items-center justify-center">
          <span className="text-white text-xs text-center pb-2 font-semibold">
            Best Deal
          </span>
        </div>

        {/* Flight Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 md:h-[160px]">
          {/* Airline Logo and Name */}
          <div className="flex items-center gap-4">
            <Image src={biman} alt="airline logo" className="w-14 h-auto" />
            <span className="text-sm font-medium">
              {segment?.operating_airline || "Unknown Airline"}
            </span>
          </div>

          {/* Flight Information */}
          <div className="flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span>
                {segment?.DepartureDateTime
                  ? new Date(segment.DepartureDateTime).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit", hour12: true }
                    )
                  : "N/A"}
              </span>
              <Image src={arrowRight} alt="Flight Path Arrow" className="mx-2" />
              <span>
                {segment?.ArrivalDateTime
                  ? new Date(segment.ArrivalDateTime).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit", hour12: true }
                    )
                  : "N/A"}
              </span>
            </div>
            <div className="flex flex-col justify-center space-y-2 items-center">
              <span className="">
                {segment?.stops === 0 ? "Non-stop" : `${segment?.stops} Stops`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>{segment?.DepartureAirportLocationCode || "N/A"}</span>
              <span>{segment?.ArrivalAirportLocationCode || "N/A"}</span>
            </div>
          </div>

          {/* Fare Information */}
          <div className="flex flex-col justify-between items-end">
            <div className="text-right space-y-2">
              {fare?.BaseFare && (
                <p className="text-sm text-gray-500 line-through">
                  ${fare.BaseFare}
                </p>
              )}
              <p className="text-yellow-600 text-2xl font-bold">
                ${fare?.TotalFare || "N/A"}
              </p>
            </div>
            <button className="bg-purple-600 text-white py-2 px-6 rounded-lg flex items-center justify-center space-x-2">
              <span>Select</span>
              <Image src={right} alt="Right Arrow" />
            </button>
          </div>
        </div>

        {/* Expandable Details Section */}
        <div className="border-t pt-4 pb-4 flex justify-between items-start text-sm">
          <FlightDetails
            index={index}
            segment={segment}
            openDetailsIndex={openDetailsIndex}
            toggleDetails={toggleDetails}
          />
          <RefundableInfo
            index={index}
            flight={flight}
            openRefundableIndex={openRefundableIndex}
            toggleRefundable={toggleRefundable}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchResult;

const FlightDetails = ({ index, segment, openDetailsIndex, toggleDetails }) => {
  return (
    <div className="pl-5">
      <button
        className="text-blue-600"
        onClick={() => toggleDetails(index)}
      >
        Flight Details {openDetailsIndex === index ? "▲" : "▼"}
      </button>
      {openDetailsIndex === index && (
        <div className="mt-2 border p-4 rounded-lg bg-gray-50 space-y-2">
          <p>
            <strong>Flight Number:</strong> {segment?.OperatingFlightNumber || "N/A"}
          </p>
          <p>
            <strong>Cabin Class:</strong> {segment?.CabinClassCode || "N/A"}
          </p>
          <p>
            <strong>Baggage Info:</strong> {segment?.CheckinBaggage?.[0]?.Value || "N/A"}{" "}
            Checked, {segment?.CabinBaggage?.[0]?.Value || "N/A"} Carry-on
          </p>
          <p>
            <strong>Equipment:</strong> {segment?.Equipment || "N/A"}
          </p>
        </div>
      )}
    </div>
  );
};

const RefundableInfo = ({ index, flight, openRefundableIndex, toggleRefundable }) => {
  return (
    <div className="pr-5">
      <button
        className="text-blue-600"
        onClick={() => toggleRefundable(index)}
      >
        Partially Refundable {openRefundableIndex === index ? "▲" : "▼"}
      </button>
      {openRefundableIndex === index && (
        <div className="mt-2 border p-4 rounded-lg bg-gray-50 space-y-2">
          <p>
            <strong>Refund Allowed:</strong> {flight?.penaltiesData?.RefundAllowed ? "Yes" : "No"}
          </p>
          <p>
            <strong>Refund Penalty:</strong> {flight?.penaltiesData?.RefundPenaltyAmount || "N/A"}{" "}
            {flight?.penaltiesData?.Currency || "N/A"}
          </p>
          <p>
            <strong>Change Allowed:</strong> {flight?.penaltiesData?.ChangeAllowed ? "Yes" : "No"}
          </p>
          <p>
            <strong>Change Penalty:</strong> {flight?.penaltiesData?.ChangePenaltyAmount || "N/A"}{" "}
            {flight?.penaltiesData?.Currency || "N/A"}
          </p>
        </div>
      )}
    </div>
  );
};
