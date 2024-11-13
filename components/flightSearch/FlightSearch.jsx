// pages/FlightSearch.js
"use client";
import { useState } from 'react';
import axios from 'axios';
import Navbar from '../common/navbar/Navbar'; // Assuming you have this component
import { MdFlightTakeoff } from "react-icons/md";
import { LiaCcVisa } from "react-icons/lia";
import { RiHotelFill } from "react-icons/ri";
import { GiTreehouse } from "react-icons/gi";
import { CiSearch } from "react-icons/ci";
import { useRouter } from 'next/navigation';

const FlightSearch = () => {

  const router = useRouter();

  const [airportSuggestions, setAirportSuggestions] = useState({
    origin: [],
    destination: []
  });


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const [departureDate, setDepartureDate] = useState(today);
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
        const { sessionId, results } = response.data;
        localStorage.setItem('flightResults', JSON.stringify({
          sessionId,
          results
        }));
        router.push('/flights');
       
      } else {
        setError('No flights found.');
      }
    } catch (err) {
      setError('An error occurred while fetching flight data.');
    } finally {
      setLoading(false);
    }
  };


  // const [cityData, setCityData] = useState([
  //   { originCode: '', destinationCode: '', journeyDate: '' }
  // ]);

  // // Function to handle input change
  // const handleInputChange = (index, field, value) => {
  //   const updatedCityData = [...cityData];
  //   updatedCityData[index][field] = value;
  //   setCityData(updatedCityData);
  // };

  // // Function to add a new city entry
  // const addCity = () => {
  //   if (cityData.length < 4) {
  //     setCityData([...cityData, { originCode: '', destinationCode: '', journeyDate: '' }]);
  //   }
  // };


  // Function to remove a city entry
  // const removeCity = (index) => {
  //   const updatedCityData = cityData.filter((_, i) => i !== index);
  //   setCityData(updatedCityData);
  // };






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


  


  // //multicity
  // const [cities, setCities] = useState([
  //   { from: "", to: "", date: "" },

  // ]);

  // const handleCityChange = (index, field, value) => {
  //   const newCities = [...cities];
  //   newCities[index][field] = value;
  //   setCities(newCities);
  // };


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
    <div className="flex  lg:w-[700px] sm:w-[500px] bg-white shadow-lg items-center w-full md:w-[700px]  py-5 px-4 md:px-8 rounded-t-[20px] justify-center gap-0.5 md:gap-6">
      <button className="py-2 ml-2 px-2 md:px-4 flex items-center w-[270px] border-b-4 border-blue-500">
        <MdFlightTakeoff className="text-blue-600 w-6 md:w-10 h-6 md:h-10" />
        <span className="text-blue-600 text-[16px] md:text-[20px] font-semibold">Flight</span>
      </button>
      <button className="py-2 px-2 md:px-4 flex items-center gap-1 text-gray-500">
        <RiHotelFill className="w-5 md:w-10 h-5 md:h-10" />
        <span className="text-[16px] md:text-[20px] font-semibold">Hotel</span>
      </button>
      <button className="py-2 px-2 md:px-4 flex items-center gap-1 text-gray-500">
        <GiTreehouse className="w-5 md:w-10 h-5 md:h-10" />
        <span className="text-[16px] md:text-[20px] font-semibold">Tour</span>
      </button>
      <button className="py-2 mr-3 px-2 md:px-4 flex items-center gap-1 text-gray-500">
        <LiaCcVisa className="w-5 md:w-10 h-5 md:h-10" />
        <span className="text-[16px] md:text-[20px] font-semibold">Visa</span>
      </button>
    </div>

    {/* Form */}
    <div className="flex flex-col w-full bg-white shadow-lg rounded-b-[20px]  xl:rounded-[20px] lg:rounded-[20px] md:rounded-[20px] sm:rounded-t-none py-8 md:p-16">
      {/* Trip Type Selection */}
      <div className="flex justify-center gap-2 md:gap-8 lg:mb-8 xl:mb-8 mb-3 md:mb-8">
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
              className="border p-3 ml-5  md:h-20 h-16 rounded-lg w-[270px] lg:w-64 md:w-64"
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
              className="border p-3 ml-5  md:h-20 h-16 rounded-lg w-[270px] lg:w-64 md:w-64"
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
            className="border p-3 ml-5  md:h-20 h-16 rounded-lg w-[270px] lg:w-64 md:w-64"
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
              className="border p-3 ml-5  md:h-20 h-16 rounded-lg w-[270px] lg:w-64 md:w-64"
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
      className="border p-3 ml-5  md:h-20 h-16 rounded-lg w-[270px] lg:w-64 md:w-64"
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
    </div>
  );
};

export default FlightSearch;


