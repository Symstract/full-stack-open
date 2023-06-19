import { useState, useEffect } from "react";
import axios from "axios";

const OPEN_WEATHER_MAP_API_KEY = import.meta.env.VITE_OPEN_WEATHER_MAP_API_KEY;

const Search = ({
  searchString,
  setSearchString,
  countries,
  setFilteredCountries,
}) => {
  const handleChange = (e) => {
    setSearchString(e.target.value);
    const filtered = countries.filter(({ name }) =>
      name.common
        .toLocaleLowerCase()
        .includes(e.target.value.toLocaleLowerCase())
    );
    setFilteredCountries(filtered);
  };

  return (
    <div>
      find countries
      <input type="text" value={searchString} onChange={handleChange} />
    </div>
  );
};

const Results = ({ filteredCountries, setFilteredCountries }) => {
  const handleClick = (country) => {
    setFilteredCountries([country]);
  };

  if (filteredCountries.length > 10) {
    return <div>Too many countries, specify another filter</div>;
  }

  return (
    <div>
      {filteredCountries.map((country) => (
        <div key={country.name.common}>
          {country.name.common}{" "}
          <button onClick={() => handleClick(country)}>show</button>
        </div>
      ))}
    </div>
  );
};

const Information = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>{`capital ${country.capital}`}</div>
      <div>{`area ${country.area}`}</div>
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img
        src={country.flags.svg}
        alt={`flag of ${country.name.common}`}
        height="150"
      />
      <Weather country={country} />
    </div>
  );
};

const Weather = ({ country }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setWeather(null);

      try {
        const geoResponse = await axios.get(
          `http://api.openweathermap.org/geo/1.0/direct?q=${country.capital}&limit=1&appid=${OPEN_WEATHER_MAP_API_KEY}`
        );
        const geoData = await geoResponse.data;
        const lat = geoData[0].lat;
        const lon = geoData[0].lon;
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPEN_WEATHER_MAP_API_KEY}`
        );
        const weatherData = await weatherResponse.data;
        setWeather(weatherData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchWeather();
  }, [country]);

  if (!weather) {
    return null;
  }

  return (
    <div>
      <h3>Weather in {country.capital}</h3>
      <p>temperature {weather.main.temp} Celcius</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
      />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  );
};

const App = () => {
  const [searchString, setSearchString] = useState("");
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://restcountries.com/v3.1/all?fields=name,capital,area,languages,flags"
      )
      .then((response) => response.data)
      .then((countries) => setCountries(countries));
  }, []);

  return (
    <div>
      <Search
        searchString={searchString}
        setSearchString={setSearchString}
        countries={countries}
        setFilteredCountries={setFilteredCountries}
      />
      {filteredCountries.length > 1 && (
        <Results
          filteredCountries={filteredCountries}
          setFilteredCountries={setFilteredCountries}
        />
      )}
      {filteredCountries.length === 1 && (
        <Information country={filteredCountries[0]} />
      )}
    </div>
  );
};

export default App;
