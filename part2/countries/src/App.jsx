import { useEffect, useState } from 'react'
import axios from 'axios' 
import CountryDetail from './components/CountryDetail'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response =>{
        setCountries(response.data)
      })
  }, [])

  const countriesToShow = search
  ? countries.filter(c =>
      c.name.common.toLowerCase().includes(search.toLowerCase())
    )
  : []
  
  const countryToShow = selectedCountry || (countriesToShow.length === 1 ? countriesToShow[0] : null)


  useEffect(() => {
    if (countryToShow && countryToShow.capital) {
      const capital = countryToShow.capital[0]
      const api_key = import.meta.env.VITE_WEATHER_KEY
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
        .then(response => {
          setWeather(response.data)
        })
        .catch(error => {
        console.log('weather fetch failed:', error.response?.status)
        setWeather(null)
      })
    }
  }, [countryToShow])

  const renderCountries = () => {
    // a country was clicked "show" → display its detail
    if (countryToShow) {
      return <CountryDetail country={countryToShow} weather={weather}/>
    }

    if (countriesToShow.length > 10) {
      return <div>Too many matches, specify another filter</div>
    }

    // 2–10 matches → list each with a show button
    return countriesToShow.map(c => (
      <div key={c.name.common}>
        {c.name.common}
        <button onClick={() => setSelectedCountry(c)}>show</button>
      </div>
    ))
  }


  return (
    <div>
      <div>
        find countries 
        <input
          value={search}
          onChange={e => {
            setSearch(e.target.value)
            setSelectedCountry(null)
          }}
        />
      </div>
      <div>
        {renderCountries()}
      </div>
    </div>
  )
}

export default App
