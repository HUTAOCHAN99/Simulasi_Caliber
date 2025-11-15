const API_KEY = '52ddbe5a4636b68d36d7c29ba5d457ea';
const JAKARTA_LAT = -6.2088;
const JAKARTA_LON = 106.8456;

async function testWeatherAPI() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${JAKARTA_LAT}&lon=${JAKARTA_LON}&appid=${API_KEY}&units=metric&lang=id`;
    
    console.log('Testing OpenWeatherMap API...');
    console.log('URL:', url);
    
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Key BERHASIL!');
      console.log('Lokasi:', data.name);
      console.log('Suhu:', data.main.temp + '°C');
      console.log('Kondisi:', data.weather[0].main);
      console.log('Deskripsi:', data.weather[0].description);
    } else {
      console.log('❌ API Key GAGAL!');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      const error = await response.text();
      console.log('Error:', error);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testWeatherAPI();