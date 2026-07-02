const CountryDetail = ({ country, weather }) => (
  <div>
    <h1>{country.name.common}</h1>
    <div>Capital: {country.capital?.[0]}</div>
    <div>Area: {country.area}</div>
    <h3>Languages</h3>
    <ul>
      {Object.values(country.languages).map(language => (
        <li key={language}>{language}</li>
      ))}
    </ul>
    <img src={country.flags.png} alt={`flag of ${country.name.common}`} width="150" />

    {weather && (
        <div>
            <h2>Weather in {country.capital[0]}</h2>
            <div>temperature {weather.main.temp} C</div>
            <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
                alt={weather.weather[0].description}
            />
            <div>Wind: {weather.wind.speed}m/s</div>
        </div>
    )}
  </div>
)

export default CountryDetail