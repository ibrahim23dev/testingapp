// pages/FlightSearch.js
"use client";
import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image'; // Import for handling Next.js images
import Navbar from '../common/navbar/Navbar'; // Assuming you have this component
import { MdFlightTakeoff } from "react-icons/md";
import { LiaCcVisa } from "react-icons/lia";
import { RiHotelFill } from "react-icons/ri";
import { GiTreehouse } from "react-icons/gi";

import biman from "@/public/images/biman-bd.png"; // Image import
import arrowRight from "@/public/icons/arrow-right.svg"; // Icon import
import credit from "@/public/icons/credit.svg"; // Icon import
import arrowDown from "@/public/icons/down-arrow.svg"; // Icon import
import arrowUp from "@/public/icons/arrowhead-up.png"; // Icon import
import right from "@/public/icons/right-arrow1.svg"; // Icon import

const FlightSearch = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [originCode, setOriginCode] = useState('');
  const [destinationCode, setDestinationCode] = useState('');
  const [tripType, setTripType] = useState('OneWay');
  const [passengerType, setPassengerType] = useState('ADT');
  const [passengerQuantity, setPassengerQuantity] = useState(1);
  const [airportSuggestions, setAirportSuggestions] = useState({
    origin: [],
    destination: []
  });

  const [isOriginFocused, setIsOriginFocused] = useState(false);
  const [isDestinationFocused, setIsDestinationFocused] = useState(false);

  const fetchFlightData = async () => {
    setLoading(true);
    setError('');

    if (!departureDate || !originCode || !destinationCode || (tripType === 'RoundTrip' && !returnDate)) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://fk-api.adbiyas.com/api/b2c/search', {
        "OriginDestinationInformations": [
          {
            "DepartureDateTime": `${departureDate}T00:00:00`,
            "OriginLocationCode": originCode,
            "DestinationLocationCode": destinationCode
          },
          ...(tripType === 'RoundTrip'
            ? [{
              "DepartureDateTime": `${returnDate}T00:00:00`,
              "OriginLocationCode": destinationCode,
              "DestinationLocationCode": originCode
            }]
            : [])
        ],
        "TravelPreferences": {
          "AirTripType": tripType
        },
        "PricingSourceType": "Public",
        "PassengerTypeQuantities": [
          {
            "Code": passengerType,
            "Quantity": passengerQuantity
          }
        ],
        "RequestOptions": "Fifty"
      });

      if (response.data.success) {
        setFlights(response.data.results);
      } else {
        setError('No flights found.');
      }
    } catch (err) {
      setError('An error occurred while fetching flight data.');
    } finally {
      setLoading(false);
    }
  };


  ///handel Airport data here 

  const fetchAirports = async (searchTerm, type) => {
    try {
      const response = await axios.get(`https://fk-api.adbiyas.com/api/common/airports?size=25&search=${searchTerm}`);
      if (response.data.success) {
        setAirportSuggestions((prev) => ({
          ...prev,
          [type]: response.data.data
        }));
      }
    } catch (err) {
      setError('Error fetching airport suggestions');
    }
  };

  const handleAirportChange = (e, type) => {
    const value = e.target.value;
    if (type === 'origin') {
      setOriginCode(value);
      if (value.length > 1) fetchAirports(value, 'origin');
    } else if (type === 'destination') {
      setDestinationCode(value);
      if (value.length > 1) fetchAirports(value, 'destination');
    }
  };




  const [openDetailsIndex, setOpenDetailsIndex] = useState(null);
  const [openRefundableIndex, setOpenRefundableIndex] = useState(null);

  const toggleDetails = (index) => {
    setOpenDetailsIndex(openDetailsIndex === index ? null : index);
  };

  const toggleRefundable = (index) => {
    setOpenRefundableIndex(openRefundableIndex === index ? null : index);
  };

  return (
    <div className="w-full flex flex-col">
      <section className="bg-[url('/images/banner-temp.jpg')] bg-cover bg-center bg-fixed w-full h-[1000px] md:max-h-screen relative">
        <Navbar />

        {/* Form Section */}
        <div className="justify-center mt-28 flex">
          <div className="justify-center flex flex-col">
            {/* Tabs for Flight, Hotel, etc. */}
            <div className="flex ml-[220px] bg-white shadow-lg w-[700px] py-5 px-8 rounded-t-[20px] justify-center gap-6">
              <button className="py-2 px-4 flex items-center gap-2 border-b-4 border-blue-500">
                <span className="text-blue-600">
                  <MdFlightTakeoff className="w-10 h-10" />
                </span>
                <span className="text-blue-600 text-[20px] font-semibold">Flight</span>
              </button>
              <button className="py-2 px-4 flex items-center gap-2 text-gray-500">
                <span>
                  <RiHotelFill className="w-10 h-10" />
                </span>
                <span className="text-[20px] font-semibold">Hotel</span>
              </button>
              <button className="py-2 px-4 flex items-center gap-2 text-gray-500">
                <span>
                  <GiTreehouse className="w-10 h-10" />
                </span>
                <span className="text-[20px] font-semibold">Tour</span>
              </button>
              <button className="py-2 px-4 flex items-center gap-2 text-gray-500">
                <span>
                  <LiaCcVisa className="w-10 h-10" />
                </span>
                <span className="text-[20px] font-semibold">Visa</span>
              </button>
            </div>

            {/* Form */}
            <div className="flex flex-col items-center px-12 py-8 bg-white shadow-lg rounded-[20px]">
              {/* Trip Type Selection */}
              <div className="flex justify-center gap-8 mb-8">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    className="text-sky-400/50 w-5 h-5"
                    value="OneWay"
                    checked={tripType === 'OneWay'}
                    onChange={(e) => setTripType(e.target.value)}
                  />
                  <span className="text-[18px]">One Way</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    className="text-sky-400/50 w-5 h-5"
                    value="RoundTrip"
                    checked={tripType === 'RoundTrip'}
                    onChange={(e) => setTripType(e.target.value)}
                  />
                  <span className="text-[18px]">Round Way</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    className="text-sky-400/50 w-5 h-5"
                    value="MultiCity"
                    checked={tripType === 'MultiCity'}
                    onChange={(e) => setTripType(e.target.value)}
                  />
                  <span className="text-[18px]">Multi City</span>
                </label>
              </div>

              {/* Form Inputs */}
              <div className="flex flex-wrap justify-center gap-6">
                {/* Origin */}
                <div className="flex flex-col items-start">
                  <label className="text-gray-600 mb-2">From</label>

                  <input
                    type="text"
                    value={originCode}
                    onChange={(e) => handleAirportChange(e, 'origin')}
                    placeholder="Enter Origin (e.g., DAC)"
                    className="border p-3 h-20 rounded-lg w-64"
                    onFocus={() => setIsOriginFocused(true)}
                    onBlur={() => setTimeout(() => setIsOriginFocused(false), 200)} // Delay for selection
                  />
                  {isOriginFocused && airportSuggestions.origin.length > 0 && (
                    <ul className="border w-64 max-h-40 overflow-y-auto">
                      {airportSuggestions.origin.map((airport, index) => (
                        <li
                          key={index}
                          onClick={() => setOriginCode(airport.iata)}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {airport.name} ({airport.iata}), {airport.city}, {airport.country}
                        </li>
                      ))}
                    </ul>
                  )}

                </div>

                {/* Destination */}
                <div className="flex flex-col items-start">
                  <label className="text-gray-600 mb-2">To</label>
                  <input
                    type="text"
                    value={destinationCode}
                    onChange={(e) => handleAirportChange(e, 'destination')}
                    placeholder="Enter Destination (e.g., CXB)"
                    className="border p-3 h-20 rounded-lg w-64"
                    onFocus={() => setIsDestinationFocused(true)}
                    onBlur={() => setTimeout(() => setIsDestinationFocused(false), 200)} // Delay for selection
                  />
                  {isDestinationFocused && airportSuggestions.destination.length > 0 && (
                    <ul className="border w-64 max-h-40 overflow-y-auto">
                      {airportSuggestions.destination.map((airport, index) => (
                        <li
                          key={index}
                          onClick={() => setDestinationCode(airport.iata)}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {airport.name} ({airport.iata}), {airport.city}, {airport.country}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Journey Date */}
                <div className="flex flex-col items-start">
                  <label className="text-gray-600 mb-2">Journey Date</label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="border h-20 p-3 rounded-lg w-64"
                  />
                </div>

                {/* Return Date */}
                {tripType === 'RoundTrip' && (
                  <div className="flex flex-col items-start">
                    <label className="text-gray-600 mb-2">Return Date</label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="border p-3 h-20 rounded-lg w-64"
                    />
                  </div>
                )}

                {/* Traveler & Class */}
                <div className="flex flex-col items-start">
                  <label className="text-gray-600 mb-2">Traveler, Class</label>
                  <div className="flex items-center gap-4">
                    <select
                      value={passengerType}
                      onChange={(e) => setPassengerType(e.target.value)}
                      className="border p-3 h-20 rounded-lg"
                    >
                      <option value="ADT">Adult (ADT)</option>
                      <option value="CHD">Child (CHD)</option>
                      <option value="INF">Infant (INF)</option>
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={passengerQuantity}
                      onChange={(e) => setPassengerQuantity(e.target.value)}
                      className="border p-3 h-20 px-5 rounded-lg w-20"
                    />
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={fetchFlightData}
                className="mt-6 bg-purple-600 text-white px-10 py-3 rounded-lg text-lg font-semibold flex items-center gap-2"
              >
                <i className="fas fa-search"></i> Search Flights
              </button>
            </div>
          </div>
        </div>

        {/* Loader and Error Messages */}
        <div>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
              <div class="loader">
                <div class="wait"> Loading...</div>
                <div class="iata_code departure_city">

                </div>
                <div class="plane">
                  <img src="https://zupimages.net/up/19/34/4820.gif" class="plane-img" />
                </div>
                <div class="earth-wrapper">
                  <div class="earth"></div>
                </div>

              </div>
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}
        </div>

      </section>


      {/* Display Flight Results */}
      <section className=" bg-slate-200 w-full">
        <div className="flex justify-center w-full">
          <div className="grid grid-cols-1 mt-[80px] gap-6">
            {flights.map((flight, index) => {
              const segment = flight?.segments?.[0];
              const fare = flight?.fares;
              console.log(flights)
              if (!segment || !fare) return null;

              const imgUrl = segment?.OperatingCarrierCode
                ? `https://premium255.web-hosting.com:2083/cpsess8408782632/viewer/home%2farcnknob%2fassets%2fairlines/${segment.OperatingCarrierCode}.png`
                : '/images/default-airline-logo.png'; // Fallback image

              return (
                <div key={index} className="space-y-8">
                  <div className="max-w-[1000px] bg-white relative rounded-2xl shadow-md">
                    {/* Best Deal Badge */}
                    <div className="absolute left-[-12px] top-3 bg-[url('/images/badge.png')] bg-no-repeat bg-contain w-28 h-10 flex items-center justify-center">
                      <span className="text-white text-xs text-center pb-2 font-semibold">Best Deal</span>
                    </div>

                    {/* Flight Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 md:h-[160px]">
                      {/* Airline Logo and Name */}
                      <div className="flex items-center gap-4">
                        <Image src={biman} alt="airline logo" className="w-14 h-auto" />
                        <span className="text-sm font-medium">{segment?.operating_airline || 'Unknown Airline'}</span>
                      </div>

                      {/* Flight Information */}
                      <div className="flex flex-col justify-between">
                        <div className="flex justify-between items-center">
                          <span>{segment?.DepartureDateTime ? new Date(segment.DepartureDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}</span>
                          <span>{segment?.ArrivalDateTime ? new Date(segment.ArrivalDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}</span>
                        </div>

                        <div className="flex items-center justify-center flex-col space-y-2">
                          <span className="text-sm">{segment?.stops === 0 ? 'Non-stop' : `${segment.stops} Stops`}</span>
                          <Image src={arrowRight} alt="Flight Path Arrow" />
                        </div>

                        <div className="flex justify-between items-center">
                          <span>{segment?.DepartureAirportLocationCode || 'N/A'}</span>
                          <span>{segment?.ArrivalAirportLocationCode || 'N/A'}</span>
                        </div>
                      </div>

                      {/* Fare Information */}
                      <div className="flex flex-col justify-between items-end">
                        <div className="text-right space-y-2">
                          {fare.BaseFare && <p className="text-sm text-gray-500 line-through">${fare.BaseFare}</p>}
                          <p className="text-yellow-600 text-2xl font-bold">${fare.TotalFare || 'N/A'}</p>
                        </div>

                        <button className="bg-purple-600 text-white py-2 px-6 rounded-lg flex items-center justify-center space-x-2">
                          <span>Select</span>
                          <Image src={right} alt="Right Arrow" />
                        </button>
                      </div>
                    </div>

                    {/* Expandable Details Section */}
                    <div className="border-t pt-4 pb-4 flex justify-between items-start text-sm">
                      {/* Flight Details */}
                      <div className=' pl-5'>
                        <button className="text-blue-600" onClick={() => toggleDetails(index)}>
                          Flight Details {openDetailsIndex === index ? '▲' : '▼'}
                        </button>
                        {openDetailsIndex === index && (
                          <div className="mt-2 border p-4 rounded-lg bg-gray-50 space-y-2">
                            <p><strong>Flight Number:</strong> {segment?.OperatingFlightNumber || 'N/A'}</p>
                            <p><strong>Cabin Class:</strong> {segment?.CabinClassCode || 'N/A'}</p>
                            <p><strong>Baggage Info:</strong> {segment?.CheckinBaggage?.[0]?.Value || 'N/A'} Checked, {segment?.CabinBaggage?.[0]?.Value || 'N/A'} Carry-on</p>
                            <p><strong>Equipment:</strong> {segment?.Equipment || 'N/A'}</p>
                          </div>
                        )}
                      </div>

                      {/* Refund Information */}
                      <div className=' pr-5'>
                        <button className="text-blue-600" onClick={() => toggleRefundable(index)}>
                          Partially Refundable {openRefundableIndex === index ? '▲' : '▼'}
                        </button>
                        {openRefundableIndex === index && (
                          <div className="mt-2 border p-4 rounded-lg bg-gray-50 space-y-2">
                            <p><strong>Refund Allowed:</strong> {flight.penaltiesData?.RefundAllowed ? 'Yes' : 'No'}</p>
                            <p><strong>Refund Penalty:</strong> {flight.penaltiesData?.RefundPenaltyAmount || 'N/A'} {flight.penaltiesData?.Currency || 'N/A'}</p>
                            <p><strong>Change Allowed:</strong> {flight.penaltiesData?.ChangeAllowed ? 'Yes' : 'No'}</p>
                            <p><strong>Change Penalty:</strong> {flight.penaltiesData?.ChangePenaltyAmount || 'N/A'} {flight.penaltiesData?.Currency || 'N/A'}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FlightSearch;
