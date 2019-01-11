import React, { Component } from 'react';
import './App.css';

import ky from 'ky';

const iconMap = {
  'clear-day': 'day-sunny',
  'clear-night': 'night-clear',
  'rain': 'rain',
  'snow': 'snow',
  'sleet': 'sleet',
  'wind': 'strong-wind',
  'fog': 'fog',
  'cloudy': 'cloudy',
  'partly-cloudy-day': 'day-cloudy',
  'partly-cloudy-night': 'night-alt-cloudy'
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPosition: false,
      position: {
        coords: {
          latitude: 0,
          longitude: 0
        }
      },
      showContent: false,
      showError: false,
      weather: {
        currently: {},
        daily: { data: [] }
      }
    };

    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        hasPosition: true,
        position: { latitude: position.coords.latitude, longitude: position.coords.longitude }
      });
    });

    setTimeout(async () => {
      if (this.state.hasPosition) {
        try {
          let weather = await ky.get(`https://cors-anywhere.herokuapp.com/https://quether.herokuapp.com/weather?lat=${this.state.position.latitude}&long=${this.state.position.longitude}`).json();

          weather.weather.daily.data.length = 4;

          this.setState({
            showContent: true,
            weather: weather.weather
          });
        } catch (error) {
          console.log(error);
          this.setState({
            showError: true
          });
        }
      } else {
        this.setState({
          showError: true
        });
      }
    }, 500);
  }

  render() {
    const state = this.state;
    const currentWeather = state.weather.currently;
    const dailies = state.weather.daily.data.map((dailyData, index) => {
      return (
        <div className="daily col s12 m3" key={index}>
          <div className="card blue-grey darken-4">
            <div className="card-content white-text">
              <span className="card-title">{new Date(dailyData.time * 1000).toLocaleDateString('en-us', { weekday: 'short' })}</span>
              <p className="weather-status">
                <i className={`wi wi-${iconMap[dailyData.icon] || 'clear-day'}`}></i>
                <span className="weather-short-attributes">{dailyData.temperatureMax}&#176;&nbsp;<span className="grey-text text-lighten-1">{dailyData.temperatureMin}&#176;</span></span>
              </p>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className="App">
        <header>
          <h1>Quether</h1>
          <h2>The Quick Weather App</h2>
        </header>
        <section className={`content container ${(state.showContent ? 'show' : '')}`}>
          <div className="weather">
            <div className="row">
              <div className="current col s12 m6 offset-m3">
                <div className="card blue-grey darken-1">
                  <div className="card-content white-text">
                    <span className="card-title">{new Date().toLocaleDateString('en-us', { weekday: 'long' })} (Today)</span>
                    <p className="weather-status">
                      <i className={`wi wi-${iconMap[currentWeather.icon] || 'clear-day'}`}></i> {currentWeather.temperature}&#176;
                    </p>
                    <p className="weather-summary">{currentWeather.summary}</p>
                    <div className="row">
                      <div className="col s6 center-align"><i className="wi wi-strong-wind"></i> <span className="weather-attribute">&nbsp;{currentWeather.windSpeed} MPH</span></div>
                      <div className="col s6 center-align"><i className="wi wi-humidity"></i> <span className="weather-attribute">&nbsp;{currentWeather.humidity}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              {dailies}
            </div>
          </div>
        </section>
        <section className={`content container ${(state.showError ? 'show' : '')}`}>
        <div className="geolocation row">
          <div className="current col s12 m6 offset-m3">
            <div className="card blue-grey darken-1">
              <div className="card-content">
                <span className="card-title red-text text-lighten-2">An Error, There Is!</span>
                <p className="red-text text-lighten-3">
                  While your location we are missing, get your weather: we cannot. Allow us to access it, then try again, you must.
                </p>
              </div>
            </div>
          </div>
        </div>
        </section>
        <footer>
          <span className="contact">Questions? Contact me at greysonrichey (at) gmail (dot) com!</span>
        </footer>
      </div>
    );
  }
}

export default App;
