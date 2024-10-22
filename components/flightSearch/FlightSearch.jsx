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
import right from "@/public/icons/right-arrow1.svg"; // Icon import

const FlightSearch = () => {
  const [airportSuggestions, setAirportSuggestions] = useState({
    origin: [],
    destination: []
  });

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [originCode, setOriginCode] = useState('');
  const [destinationCode, setDestinationCode] = useState('');
  const [tripType, setTripType] = useState('OneWay'); // Default trip type is OneWay
  const [passengerType, setPassengerType] = useState('ADT');
  const [passengerQuantity, setPassengerQuantity] = useState(1);

  // For OpenJaw trip
  const [secondDepartureDate, setSecondDepartureDate] = useState('');
  const [secondOriginCode, setSecondOriginCode] = useState('');
  const [secondDestinationCode, setSecondDestinationCode] = useState('');
  const [thirdDepartureDate, setThirdDepartureDate] = useState('');
  const [thirdOriginCode, setThirdOriginCode] = useState('');
  const [thirdDestinationCode, setThirdDestinationCode] = useState('');

  const [isOriginFocused, setIsOriginFocused] = useState(false);
  const [isDestinationFocused, setIsDestinationFocused] = useState(false);

  const fetchFlightData = async () => {
    setLoading(true);
    setError('');

    // Validate required fields
    if (!departureDate || !originCode || !destinationCode ||
      (tripType === 'Return' && !returnDate) ||
      (tripType === 'OpenJaw' && (!secondDepartureDate || !secondOriginCode || !secondDestinationCode || !thirdDepartureDate || !thirdOriginCode || !thirdDestinationCode))
    ) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    let originDestinations = [];

    // Handle OneWay trip type
    if (tripType === 'OneWay') {
      originDestinations.push({
        "DepartureDateTime": `${departureDate}T00:00:00`,
        "OriginLocationCode": originCode,
        "DestinationLocationCode": destinationCode
      });
    }

    // Handle Return trip type
    if (tripType === 'Return') {
      originDestinations.push(
        {
          "DepartureDateTime": `${departureDate}T00:00:00`,
          "OriginLocationCode": originCode,
          "DestinationLocationCode": destinationCode
        },
        {
          "DepartureDateTime": `${returnDate}T00:00:00`,
          "OriginLocationCode": destinationCode,
          "DestinationLocationCode": originCode
        }
      );
    }

    // Handle OpenJaw trip type
    if (tripType === 'OpenJaw') {
      originDestinations.push(
        {
          "DepartureDateTime": `${departureDate}T00:00:00`,
          "OriginLocationCode": originCode,
          "DestinationLocationCode": destinationCode
        },
        {
          "DepartureDateTime": `${secondDepartureDate}T00:00:00`,
          "OriginLocationCode": secondOriginCode,
          "DestinationLocationCode": secondDestinationCode
        },
        {
          "DepartureDateTime": `${thirdDepartureDate}T00:00:00`,
          "OriginLocationCode": thirdOriginCode,
          "DestinationLocationCode": thirdDestinationCode
        }
      );
    }

    try {
      const response = await axios.post('https://fk-api.adbiyas.com/api/b2c/search', {
        "OriginDestinationInformations": originDestinations,
        "TravelPreferences": {
          "AirTripType": tripType
        },
        "PricingSourceType": "Public", // or "Private", "All"
        "PassengerTypeQuantities": [
          {
            "Code": passengerType, // "ADT" for adults, "CHD" for children, "INF" for infants
            "Quantity": passengerQuantity
          }
        ],
        "RequestOptions": "Fifty" // or any other number you need
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


  //multicity
  const [cities, setCities] = useState([
    { from: "", to: "", date: "" },

  ]);

  const handleCityChange = (index, field, value) => {
    const newCities = [...cities];
    newCities[index][field] = value;
    setCities(newCities);
  };

  const addCity = () => {
    if (cities.length < 6) {
      setCities([...cities, { from: "", to: "", date: "" }]);
    }
  };

  const removeCity = (index) => {
    const newCities = cities.filter((_, i) => i !== index);
    setCities(newCities);
  }



  const [showModal, setShowModal] = useState(false);
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    classType: "Economy",
  });

  const totalTravelers = passengers.adults + passengers.children + passengers.infants;
  const updatePassengerCount = (type, value) => {
    setPassengers((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + value),
    }));
  };

  const handleClassChange = (e) => {
    setPassengers((prev) => ({ ...prev, classType: e.target.value }));
  };

  const closeModal = () => {
    setShowModal(false);
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
                    value="Return"
                    checked={tripType === 'Return'}
                    onChange={(e) => setTripType(e.target.value)}
                  />
                  <span className="text-[18px]">Round Way</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    className="text-sky-400/50 w-5 h-5"
                    value="OpenJaw"
                    checked={tripType === 'OpenJaw'}
                    onChange={(e) => setTripType(e.target.value)}
                  />
                  <span className="text-[18px]">Multi City</span>
                </label>
              </div>

              {/* Form Inputs */}

              <div className="mt-5 flex items-center justify-evenly gap-5 flex-wrap">
              <div className="flex  flex-wrap justify-center gap-6">
                {/* Origin */}
               <div className="flex flex-col items-start">
  <label className="text-gray-600 mb-2">From</label>
  <div className="relative">
    <input
      type="text"
      value={
        originCode && originCode.city && originCode.iata 
          ? `${originCode.city} (${originCode.iata}), ${originCode.name}` 
          : originCode // This will show the selected airport details or allow typing 
      }
      onChange={(e) => handleAirportChange(e, 'origin')}
      placeholder="Enter Origin (e.g., DAC)"
      className="border p-3 h-20 rounded-lg w-64"
      onFocus={() => setIsOriginFocused(true)}
      onBlur={() => setTimeout(() => setIsOriginFocused(false), 50)} // Delay for selection
    />
    {isOriginFocused && airportSuggestions.origin.length > 0 && (
      <ul className="absolute z-10 bg-white border border-gray-200 w-64 max-h-60 overflow-y-auto mt-1 rounded-lg shadow-lg">
        {airportSuggestions.origin.map((airport, index) => (
          <li
            key={index}
            onClick={() => {
              setOriginCode(airport); // Store the entire airport object
              setIsOriginFocused(false); // Close the dropdown after selection
            }}
            className="p-2 hover:bg-gray-100 cursor-pointer"
          >
            <span className="block text-center font-semibold text-black">
              {airport.city}
            </span>
            <span className="block text-sm text-center text-gray-500">
              {airport.name} ({airport.iata}), {airport.country}
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>



                {/* Destination */}
                <div className="flex flex-col items-start">
                  
                  <label className="text-gray-600 mb-2">To</label>
                  <div className=' relative'>
                  <input
                    type="text"
                    value={destinationCode}
                    onChange={(e) => handleAirportChange(e, 'destination')}
                    placeholder="Enter Destination (e.g., CXB)"
                    className="border p-3 h-20 rounded-lg w-64"
                    onFocus={() => setIsDestinationFocused(true)}
                    onBlur={() => setTimeout(() => setIsDestinationFocused(false), 50)} // Delay for selection
                  />
                  {isDestinationFocused && airportSuggestions.destination.length > 0 && (
                    <ul className="absolute z-10 bg-white border border-gray-200 w-64 max-h-60 overflow-y-auto mt-1 rounded-lg shadow-lg">
                      {airportSuggestions.destination.map((airport, index) => (
                        <li
                          key={index}
                          onClick={() => setDestinationCode(airport.iata)}
                           className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                           <span className="block text-center font-semibold text-black"> {airport.city}</span>
                           <span className="block text-sm text-center text-gray-500">
                          {airport.name} ({airport.iata}), {airport.country}
                              </span>
                       
                        </li>
                      ))}
                    </ul>
                  )}
                  </div>
                  
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
                {tripType === 'Return' && (
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

                {/* OpenJaw Section */}
                {tripType === 'OpenJaw' && (
                  <div className="w-full">
                    <div className="flex justify-center gap-6 flex-wrap">
                      {/* Second Leg */}
                      <div className="flex flex-col items-start">
                        <label className="text-gray-600 mb-2">Second Origin</label>
                        type="text"
                        value={originCode}
                        onChange={(e) => handleAirportChange(e, 'origin')}
                        placeholder="Enter Origin (e.g., DAC)"
                        className="border p-3 h-20 rounded-lg w-64"
                        onFocus={() => setIsOriginFocused(true)}
                        onBlur={() => setTimeout(() => setIsOriginFocused(false), 50)}
                      </div>
                      <div className="flex flex-col items-start">
                        <label className="text-gray-600 mb-2">Second Destination</label>
                        <input
                          type="text"
                          value={secondDestinationCode}
                          onChange={(e) => setSecondDestinationCode(e.target.value)}
                          placeholder="Enter Second Destination"
                          className="border p-3 h-12 rounded-lg w-64"
                        />
                      </div>
                      <div className="flex flex-col items-start">
                        <label className="text-gray-600 mb-2">Second Journey Date</label>
                        <input
                          type="date"
                          value={secondDepartureDate}
                          onChange={(e) => setSecondDepartureDate(e.target.value)}
                          className="border p-3 h-12 rounded-lg w-64"
                        />
                      </div>

                      {/* Third Leg */}
                      <div className="flex flex-col items-start">
                        <label className="text-gray-600 mb-2">Third Origin</label>
                        <input
                          type="text"
                          value={thirdOriginCode}
                          onChange={(e) => setThirdOriginCode(e.target.value)}
                          placeholder="Enter Third Origin"
                          className="border p-3 h-12 rounded-lg w-64"
                        />
                      </div>
                      <div className="flex flex-col items-start">
                        <label className="text-gray-600 mb-2">Third Destination</label>
                        <input
                          type="text"
                          value={thirdDestinationCode}
                          onChange={(e) => setThirdDestinationCode(e.target.value)}
                          placeholder="Enter Third Destination"
                          className="border p-3 h-12 rounded-lg w-64"
                        />
                      </div>
                      <div className="flex flex-col items-start">
                        <label className="text-gray-600 mb-2">Third Journey Date</label>
                        <input
                          type="date"
                          value={thirdDepartureDate}
                          onChange={(e) => setThirdDepartureDate(e.target.value)}
                          className="border p-3 h-12 rounded-lg w-64"
                        />
                      </div>
                    </div>
                  </div>
                )}

<div className="relative flex flex-col items-start">
      {/* Traveler & Class Label */}
      <label className="text-gray-600 mb-2">Traveler, Class</label>

      {/* Input field that triggers modal */}
      <div className="flex items-center gap-4">
      <input
          type="text"
          value={`${totalTravelers} Traveler${totalTravelers > 1 ? "s" : ""} • ${passengers.classType}`}
          onClick={() => setShowModal(true)}
          readOnly
          className="border text-[20px] font-semibold p-3 h-20 rounded-lg w-80 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="absolute left-0 mt-4 bg-white rounded-lg shadow-lg p-6 w-full z-50">
          <h2 className="text-lg font-semibold mb-4">Select Travelers and Class</h2>

          {/* Adult Count */}
          <div className="flex justify-between mb-3">
            <div>
              <p className="font-medium">Adults</p>
              <p className="text-gray-500 text-sm">12 years and above</p>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => updatePassengerCount("adults", -1)}
                className="border rounded-full w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300"
              >
                -
              </button>
              <p className="mx-3">{passengers.adults}</p>
              <button
                onClick={() => updatePassengerCount("adults", 1)}
                className="border rounded-full w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>

          {/* Children Count */}
          <div className="flex justify-between mb-3">
            <div>
              <p className="font-medium">Children</p>
              <p className="text-gray-500 text-sm">2-11 years</p>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => updatePassengerCount("children", -1)}
                className="border rounded-full w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300"
              >
                -
              </button>
              <p className="mx-3">{passengers.children}</p>
              <button
                onClick={() => updatePassengerCount("children", 1)}
                className="border rounded-full w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>

          {/* Infants Count */}
          <div className="flex justify-between mb-3">
            <div>
              <p className="font-medium">Infants</p>
              <p className="text-gray-500 text-sm">Below 2 years</p>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => updatePassengerCount("infants", -1)}
                className="border rounded-full w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300"
              >
                -
              </button>
              <p className="mx-3">{passengers.infants}</p>
              <button
                onClick={() => updatePassengerCount("infants", 1)}
                className="border rounded-full w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>

          {/* Class Selection */}
          <div className="mb-5">
            <p className="font-medium mb-2">Class</p>
            <div className="flex items-center gap-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="Economy"
                  checked={passengers.classType === "Economy"}
                  onChange={handleClassChange}
                  className="mr-2"
                />
                Economy
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="Business"
                  checked={passengers.classType === "Business"}
                  onChange={handleClassChange}
                  className="mr-2"
                />
                Business
              </label>
            </div>
          </div>

          {/* Done Button */}
          <div className="flex justify-end">
            <button
              onClick={closeModal}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
            >
              Done
            </button>
          </div>
        </div>
      )}
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
              const imageurl = flight?.airline_img;
              console.log(flights)
              if (!segment || !fare) return null;

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
                        <Image src={imageurl} alt="airline logo" width={50}
                          height={50}
                          priority={true} className="w-19 h-auto" />
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



//Flight result components

const SearchResult = ({ flight, segment, fare, imgUrl, index, openDetailsIndex, toggleDetails, openRefundableIndex, toggleRefundable }) => {

  return (
    <div className="space-y-8">
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
            <span className="text-sm font-medium">{segment?.operating_airline || "Unknown Airline"}</span>
          </div>

          {/* Flight Information */}
          <div className="flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span>{segment?.DepartureDateTime ? new Date(segment.DepartureDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }) : "N/A"}</span>
              <span>{segment?.ArrivalDateTime ? new Date(segment.ArrivalDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }) : "N/A"}</span>
            </div>
            <div className="flex items-center justify-center flex-col space-y-2">
              <span className="text-sm">{segment?.stops === 0 ? "Non-stop" : `${segment.stops} Stops`}</span>
              <Image src={arrowRight} alt="Flight Path Arrow" />
            </div>
            <div className="flex justify-between items-center">
              <span>{segment?.DepartureAirportLocationCode || "N/A"}</span>
              <span>{segment?.ArrivalAirportLocationCode || "N/A"}</span>
            </div>
          </div>

          {/* Fare Information */}
          <div className="flex flex-col justify-between items-end">
            <div className="text-right space-y-2">
              {fare.BaseFare && <p className="text-sm text-gray-500 line-through">${fare.BaseFare}</p>}
              <p className="text-yellow-600 text-2xl font-bold">${fare.TotalFare || "N/A"}</p>
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
}



const FlightDetails = ({ index, segment, openDetailsIndex, toggleDetails }) => {
  return (
    <div className="pl-5">
      <button className="text-blue-600" onClick={() => toggleDetails(index)}>
        Flight Details {openDetailsIndex === index ? "▲" : "▼"}
      </button>
      {openDetailsIndex === index && (
        <div className="mt-2 border p-4 rounded-lg bg-gray-50 space-y-2">
          <p><strong>Flight Number:</strong> {segment?.OperatingFlightNumber || "N/A"}</p>
          <p><strong>Cabin Class:</strong> {segment?.CabinClassCode || "N/A"}</p>
          <p><strong>Baggage Info:</strong> {segment?.CheckinBaggage?.[0]?.Value || "N/A"} Checked, {segment?.CabinBaggage?.[0]?.Value || "N/A"} Carry-on</p>
          <p><strong>Equipment:</strong> {segment?.Equipment || "N/A"}</p>
        </div>
      )}
    </div>
  );
};


