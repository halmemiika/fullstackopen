import React, { useState, useEffect } from "react";
import axios from "axios";

const WeatherInfo = ({ weather }) => {
  return (
    <>
      <h2>Weather in {weather.location.name}</h2>
      <p>
        <b>temperature:</b> {weather.current.temp_c} Celcius
      </p>
      <img
        src={weather.current.condition.icon}
        style={{ height: 75 }}
        alt="weather-img"
      ></img>
      <p>
        <b>wind:</b> {weather.current.wind_kph} kph direction{" "}
        {weather.current.wind_dir}
      </p>
    </>
  );
};

const CountryInfo = ({ countries, countryDetails, weather }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (countries.length < 10 && countries.length > 1) {
    return (
      <>
        {countries.map((country) => (
          <p key={country.name}>
            {country.name}
            <button onClick={countryDetails} value={country.name}>
              show
            </button>
          </p>
        ))}
      </>
    );
  } else if (countries.length === 1) {
    const country = countries[0];
    return (
      <>
        <h1>{country.name}</h1>
        <p>capital {country.capital}</p>
        <p>population {country.population} </p>
        <h2>Spoken languages</h2>
        <ul>
          {country.languages.map((language) => (
            <li key={language.name}>{language.name}</li>
          ))}
        </ul>
        <img src={country.flag} style={{ height: 100 }} alt="flag-img"></img>
        <WeatherInfo weather={weather} />
      </>
    );
  } else {
    return <p>Your search does not match any country</p>;
  }
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [renderCountry, setRenderCountry] = useState([]);
  const [searchInput, setSearch] = useState("");
  const [weather, setWeather] = useState([]);

  const api_key = process.env.REACT_APP_API_KEY;

  const hook = () => {
    axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
      setCountries(response.data);
    });
  };

  useEffect(hook, []);

  const handleSearchChange = (event) => {
    setSearch(event.target.value.toLowerCase());
  };

  useEffect(() => {
    setRenderCountry(
      countries.length === 1
        ? countries
        : countries.filter(
            (country) => country.name.toLowerCase().indexOf(searchInput) !== -1
          )
    );
  }, [searchInput, countries]);

  const countryDetails = (event) => {
    const name = event.target.value;
    const index = countries.findIndex((country) => country.name === name);
    setSearch(countries[index].name.toLowerCase());
    setRenderCountry(
      countries.filter(
        (country) => country.name.toLowerCase().indexOf(searchInput) !== -1
      )
    );
  };

  const params = {
    key: api_key,
    q: renderCountry.length === 1 ? renderCountry[0].capital : "Helsinki",
  };

  const weatherHook = () => {
    axios
      .get(" http://api.weatherapi.com/v1/current.json", { params })
      .then((response) => setWeather(response.data));
  };

  useEffect(weatherHook, [weatherHook]);

  return (
    <div>
      find countries <input onChange={handleSearchChange} />
      <CountryInfo
        countries={renderCountry}
        countryDetails={countryDetails}
        weather={weather}
      />
    </div>
  );
};

export default App;
