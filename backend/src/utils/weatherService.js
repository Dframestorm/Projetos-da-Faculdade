const axios = require('axios');

exports.getWeatherForecast = async (city, appointmentDate) => {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    // Buscamos a previsão para os próximos 5 dias
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`;
    
    const response = await axios.get(url);
    const forecasts = response.data.list;

    // Procuramos a previsão mais próxima do horário da consulta
    const targetTime = new Date(appointmentDate).getTime();
    const closestForecast = forecasts.reduce((prev, curr) => {
      const prevTime = new Date(prev.dt_txt).getTime();
      const currTime = new Date(curr.dt_txt).getTime();
      return Math.abs(currTime - targetTime) < Math.abs(prevTime - targetTime) ? curr : prev;
    });

    return {
      condition: closestForecast.weather[0].description,
      willRain: closestForecast.weather[0].main.toLowerCase().includes('rain')
    };
  } catch (error) {
    console.error('Erro ao buscar clima:', error.message);
    return { condition: 'Não disponível', willRain: false };
  }
};