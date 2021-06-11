import React, { useState, useEffect } from "react";
import axios from "axios";

const CountryInfo = ({ countries, countryDetails }) => {
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
        <h2>languages</h2>
        <ul>
          {country.languages.map((language) => (
            <li key={language.name}>{language.name}</li>
          ))}
        </ul>
        <img src={country.flag} style={{ height: 100 }} alt="flag-img"></img>
      </>
    );
  } else {
    return <p>Your search does not match any country</p>;
  }
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchInput, setSearch] = useState("");

  const hook = () => {
    axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
      setCountries(response.data);
    });
  };

  useEffect(hook, []);

  const searchCountry = (event) => {
    setSearch(event.target.value.toLowerCase());
  };

  const filterCountries = countries.filter(
    (country) => country.name.toLowerCase().indexOf(searchInput) !== -1
  );

  const countryDetails = (event) => {
    const name = event.target.value;
    const index = countries.findIndex((country) => country.name === name);
  };

  return (
    <div>
      find countries <input onChange={searchCountry} />
      <CountryInfo
        countries={filterCountries}
        countryDetails={countryDetails}
      />
    </div>
  );
};

export default App;
