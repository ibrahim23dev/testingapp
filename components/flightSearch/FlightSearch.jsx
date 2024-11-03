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
import { CiSearch } from "react-icons/ci";

import biman from "@/public/images/biman-bd.png"; // Image import
import arrowRight from "@/public/icons/arrow-right.svg"; // Icon import
import right from "@/public/icons/right-arrow1.svg"; // Icon import
import Link from 'next/link';

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


  const [cityData, setCityData] = useState([
    { originCode: '', destinationCode: '', journeyDate: '' }
  ]);

  // Function to handle input change
  const handleInputChange = (index, field, value) => {
    const updatedCityData = [...cityData];
    updatedCityData[index][field] = value;
    setCityData(updatedCityData);
  };

  // Function to add a new city entry
  const addCity = () => {
    if (cityData.length < 4) {
      setCityData([...cityData, { originCode: '', destinationCode: '', journeyDate: '' }]);
    }
  };


  // Function to remove a city entry
  const removeCity = (index) => {
    const updatedCityData = cityData.filter((_, i) => i !== index);
    setCityData(updatedCityData);
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



  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   router.push({
  //     pathname: '/flights',
  //     query: searchData,
  //   });
  // };




  return (
    <div className="w-full flex flex-col">
      <section className="bg-[url('/images/banner-temp.jpg')] bg-cover bg-center bg-fixed w-full h-[1000px] md:max-h-screen relative">
        <Navbar />

        {/* Form Section */}
        <div className="flex justify-center items-center px-4 md:px-8 lg:px-16 mt-28">
  <div className="flex relative flex-col items-center w-full max-w-[1600px]">
    {/* Tabs for Flight, Hotel, etc. */}
    <div className="flex lg:w-[700px] sm:w-[500px] bg-white shadow-lg items-center w-full md:w-[700px] py-5 px-4 md:px-8 rounded-t-[20px] justify-center gap-4 md:gap-6">
      <button className="py-2 px-2 md:px-4 flex items-center gap-2 border-b-4 border-blue-500">
        <MdFlightTakeoff className="text-blue-600 w-8 md:w-10 h-8 md:h-10" />
        <span className="text-blue-600 text-[16px] md:text-[20px] font-semibold">Flight</span>
      </button>
      <button className="py-2 px-2 md:px-4 flex items-center gap-2 text-gray-500">
        <RiHotelFill className="w-8 md:w-10 h-8 md:h-10" />
        <span className="text-[16px] md:text-[20px] font-semibold">Hotel</span>
      </button>
      <button className="py-2 px-2 md:px-4 flex items-center gap-2 text-gray-500">
        <GiTreehouse className="w-8 md:w-10 h-8 md:h-10" />
        <span className="text-[16px] md:text-[20px] font-semibold">Tour</span>
      </button>
      <button className="py-2 px-2 md:px-4 flex items-center gap-2 text-gray-500">
        <LiaCcVisa className="w-8 md:w-10 h-8 md:h-10" />
        <span className="text-[16px] md:text-[20px] font-semibold">Visa</span>
      </button>
    </div>

    {/* Form */}
    <div className="flex flex-col w-full bg-white shadow-lg rounded-b-[20px]  xl:rounded-[20px] lg:rounded-[20px] md:rounded-[20px] sm:rounded-t-none py-8 md:p-16">
      {/* Trip Type Selection */}
      <div className="flex justify-center gap-4 md:gap-8 lg:mb-8 xl:mb-8 mb-3 md:mb-8">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            className="text-sky-400/50 w-4 h-4 md:w-5 md:h-5"
            value="OneWay"
            checked={tripType === 'OneWay'}
            onChange={(e) => setTripType(e.target.value)}
          />
          <span className="text-[14px] md:text-[18px]">One Way</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            className="text-sky-400/50 w-4 h-4 md:w-5 md:h-5"
            value="Return"
            checked={tripType === 'Return'}
            onChange={(e) => setTripType(e.target.value)}
          />
          <span className="text-[14px] md:text-[18px]">Round Way</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            className="text-sky-400/50 w-4 h-4 md:w-5 md:h-5"
            value="OpenJaw"
            checked={tripType === 'OpenJaw'}
            onChange={(e) => setTripType(e.target.value)}
          />
          <span className="text-[14px] md:text-[18px]">Multi City</span>
        </label>
      </div>

      {/* Form Inputs */}
      <div className="flex flex-wrap  gap-2">
        {/* Origin */}
        <div className="flex flex-col py-1  md:items-start lg:items-start  w-full sm:w-auto">
          <label className="text-gray-600 ml-5  mb-2">From</label>
          <div className="relative">
            <input
              type="text"
              value={
                originCode && originCode.city && originCode.iata
                  ? `${originCode.city} (${originCode.iata}), ${originCode.name}`
                  : originCode
              }
              onChange={(e) => handleAirportChange(e, 'origin')}
              placeholder="Enter Origin (e.g., DAC)"
              className="border p-3 ml-5  md:h-20 h-16 rounded-lg w-[400px] lg:w-64 md:w-64"
              onFocus={() => setIsOriginFocused(true)}
              onBlur={() => setTimeout(() => setIsOriginFocused(false), 50)}
            />
            {isOriginFocused && airportSuggestions.origin.length > 0 && (
              <ul className="absolute z-10 bg-white border w-full max-h-60 overflow-y-auto mt-1 rounded-lg shadow-lg">
                {airportSuggestions.origin.map((airport, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setOriginCode(airport);
                      setIsOriginFocused(false);
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <span className="block font-semibold text-black">{airport.city}</span>
                    <span className="block text-sm text-gray-500">
                      {airport.name} ({airport.iata}), {airport.country}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Destination */}
        <div className="flex flex-col items-start w-full sm:w-auto">
          <label className="text-gray-600 ml-5 mb-2">To</label>
          <div className="relative">
            <input
              type="text"
              value={destinationCode}
              onChange={(e) => handleAirportChange(e, 'destination')}
              placeholder="Enter Destination (e.g., CXB)"
              className="border p-3 ml-5  md:h-20 h-16 rounded-lg w-[400px] lg:w-64 md:w-64"
              onFocus={() => setIsDestinationFocused(true)}
              onBlur={() => setTimeout(() => setIsDestinationFocused(false), 50)}
            />
            {isDestinationFocused && airportSuggestions.destination.length > 0 && (
              <ul className="absolute z-10 bg-white border w-full max-h-60 overflow-y-auto mt-1 rounded-lg shadow-lg">
                {airportSuggestions.destination.map((airport, index) => (
                  <li
                    key={index}
                    onClick={() => setDestinationCode(airport.iata)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <span className="block font-semibold text-black">{airport.city}</span>
                    <span className="block text-sm text-gray-500">
                      {airport.name} ({airport.iata}), {airport.country}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Journey Date */}
        <div className="flex flex-col items-start w-full sm:w-auto">
          <label className="text-gray-600 ml-5 mb-2">Journey Date</label>
          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            className="border p-3 ml-5  md:h-20 h-16 rounded-lg w-[400px] lg:w-64 md:w-64"
          />
        </div>

        {/* Return Date */}
        {tripType === 'Return' && (
          <div className="flex flex-col items-start w-full sm:w-auto">
            <label className="text-gray-600 ml-5 mb-2">Return Date</label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="border p-3 ml-5  md:h-20 h-16 rounded-lg w-[400px] lg:w-64 md:w-64"
            />
          </div>
        )}

        {/* Traveler & Class */}
<div className=" flex items-start relative flex-col">
  {/* Traveler & Class Label */}
  <label className="text-gray-600 ml-5 mb-2">Traveler, Class</label>

  {/* Input field that triggers modal */}
  <div className="flex items-center gap-4">
    <input
      type="text"
      value={`${totalTravelers} Traveler${totalTravelers > 1 ? "s" : ""} • ${passengers.classType}`}
      onClick={() => setShowModal(true)}
      readOnly
      className="border p-3 ml-5  md:h-20 h-16 rounded-lg w-[400px] lg:w-64 md:w-64"
    />
  </div>

  {/* Modal */}
  {showModal && (
    <div className=" absolute left-0 mt-4 bg-white rounded-lg shadow-lg md:p-6 w-11/12 max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl p-6  z-50">
      
        <h2 className="text-lg font-semibold mb-4 text-center">Select Travelers and Class</h2>

        {/* Adult Count */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="font-medium">Adults</p>
            <p className="text-gray-500 text-xs sm:text-sm">12 years and above</p>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => updatePassengerCount("adults", -1)}
              className="border rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300"
            >
              -
            </button>
            <p className="mx-2 sm:mx-3">{passengers.adults}</p>
            <button
              onClick={() => updatePassengerCount("adults", 1)}
              className="border rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300"
            >
              +
            </button>
          </div>
        </div>

        {/* Children Count */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="font-medium">Children</p>
            <p className="text-gray-500 text-xs sm:text-sm">2-11 years</p>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => updatePassengerCount("children", -1)}
              className="border rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300"
            >
              -
            </button>
            <p className="mx-2 sm:mx-3">{passengers.children}</p>
            <button
              onClick={() => updatePassengerCount("children", 1)}
              className="border rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300"
            >
              +
            </button>
          </div>
        </div>

        {/* Infants Count */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="font-medium">Infants</p>
            <p className="text-gray-500 text-xs sm:text-sm">Below 2 years</p>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => updatePassengerCount("infants", -1)}
              className="border rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300"
            >
              -
            </button>
            <p className="mx-2 sm:mx-3">{passengers.infants}</p>
            <button
              onClick={() => updatePassengerCount("infants", 1)}
              className="border rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300"
            >
              +
            </button>
          </div>
        </div>

        {/* Class Selection */}
        <div className="mb-5">
          <p className="font-medium mb-2">Class</p>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center">
              <input
                type="radio"
                value="Economy"
                checked={passengers.classType === "Economy"}
                onChange={handleClassChange}
                className="mr-1"
              />
              Economy
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="Business"
                checked={passengers.classType === "Business"}
                onChange={handleClassChange}
                className="mr-1"
              />
              Business
            </label>
          </div>
        </div>

        {/* Done Button */}
        <div className="flex justify-end">
          <button
            onClick={closeModal}
            className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600"
          >
            Done
          </button>
        </div>
      
    </div>
  )}
</div>




      </div>
       {/* Search Button */}
   
    </div>
    <div className='md:absolute sm:absolute lg:absolute relative md:mt-[360px] lg:mt-[360px] xl:mt-[360px] 2xl:mt-[360px] sm:mt-[360px]'>
    <button
                onClick={fetchFlightData}
                className=" text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-9 py-5 text-center me-2 mb-2"
              >
                <div className=' flex items-center justify-center gap-2'> <span><CiSearch className=' w-7 h-7 text-white' /></span>
                <span className=' text-[20px]'> Search Flights</span></div>
               
                
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
          <div className="grid grid-cols-1 lg:grid lg:grid-cols-1 md:grid md:grid-cols-1 mt-[80px] gap-6">
            {flights.map((flight, index) => {
              const segment = flight?.segments?.[0];
              const fare = flight?.fares;
              const imageurl = flight?.airline_img;
              console.log(flights)
              if (!segment || !fare) return null;

              return (
                <div key={index} className="space-y-8">
                <div className="lg:max-w-[1200px] xl:max-w-[1200px] w-full md:max-w-[900px] sm:max-w-[600px] bg-white relative rounded-2xl shadow-md">
                  {/* Best Deal Badge */}
                  <div className="absolute left-[-12px] top-3 bg-[url('/images/badge.png')] bg-no-repeat bg-contain w-24 h-8 flex items-center justify-center sm:w-28 sm:h-10">
                    <span className="text-white text-xs sm:text-sm text-center pb-2 font-semibold">Best Deal</span>
                  </div>
              
                  {/* Flight Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 sm:p-5 md:h-auto lg:h-[160px]">
                    {/* Airline Logo and Name */}
                    <div className="flex items-center gap-4">
                      <Image src={imageurl} alt="airline logo" width={40} height={40} priority className="w-10 h-10 sm:w-12 sm:h-12" />
                      <span className="text-xs sm:text-sm font-medium">{segment?.operating_airline || 'Unknown Airline'}</span>
                    </div>
              
                    {/* Flight Information */}
                    <div className="flex flex-col justify-between sm:col-span-2 md:col-span-1">
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span>{segment?.DepartureDateTime ? new Date(segment.DepartureDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}</span>
                        <span>{segment?.ArrivalDateTime ? new Date(segment.ArrivalDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}</span>
                      </div>
              
                      <div className="flex items-center justify-center flex-col space-y-2">
                        <span className="text-xs sm:text-sm">{segment?.stops === 0 ? 'Non-stop' : `${segment.stops} Stops`}</span>
                        <Image src={arrowRight} alt="Flight Path Arrow" />
                      </div>
              
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span>{segment?.DepartureAirportLocationCode || 'N/A'}</span>
                        <span>{segment?.ArrivalAirportLocationCode || 'N/A'}</span>
                      </div>
                    </div>
              
                    {/* Fare Information */}
                    <div className="flex flex-col justify-between items-end">
                      <div className="text-right space-y-1 sm:space-y-2">
                        {fare.BaseFare && <p className="text-xs sm:text-sm text-gray-500 line-through">${fare.BaseFare}</p>}
                        <p className="text-yellow-600 text-xl sm:text-2xl font-bold">${fare.TotalFare || 'N/A'}</p>
                      </div>
                      <Link href='/booking'>
                        <button className="bg-purple-600 text-white py-1 px-4 sm:py-2 sm:px-6 rounded-lg flex items-center justify-center space-x-2 mt-3 sm:mt-0">
                          <span>Select</span>
                          <Image src={right} alt="Right Arrow" />
                        </button>
                      </Link>
                    </div>
                  </div>
              
                  {/* Expandable Details Section */}
                  <div className="border-t pt-3 pb-3 sm:pt-4 sm:pb-4 flex flex-col sm:flex-row justify-between items-start text-xs sm:text-sm px-3 sm:px-5">
                    {/* Flight Details */}
                    <div className="mb-3 sm:mb-0">
                      <button className="text-blue-600" onClick={() => toggleDetails(index)}>
                        Flight Details {openDetailsIndex === index ? '▲' : '▼'}
                      </button>
                      {openDetailsIndex === index && (
                        <div className="mt-2 border p-3 rounded-lg bg-gray-50 space-y-1 sm:space-y-2">
                          <p><strong>Flight Number:</strong> {segment?.OperatingFlightNumber || 'N/A'}</p>
                          <p><strong>Cabin Class:</strong> {segment?.CabinClassCode || 'N/A'}</p>
                          <p><strong>Baggage Info:</strong> {segment?.CheckinBaggage?.[0]?.Value || 'N/A'} Checked, {segment?.CabinBaggage?.[0]?.Value || 'N/A'} Carry-on</p>
                          <p><strong>Equipment:</strong> {segment?.Equipment || 'N/A'}</p>
                        </div>
                      )}
                    </div>
              
                    {/* Refund Information */}
                    <div>
                      <button className="text-blue-600" onClick={() => toggleRefundable(index)}>
                        Partially Refundable {openRefundableIndex === index ? '▲' : '▼'}
                      </button>
                      {openRefundableIndex === index && (
                        <div className="mt-2 border p-3 rounded-lg bg-gray-50 space-y-1 sm:space-y-2">
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


