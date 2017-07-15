var request = require('superagent');

request
  .get('http://api.openweathermap.org/data/2.5/weather')
  .query({
    q: 'Taipei',
    APPID: '2ab10d1d7c261f5cb373916cc1cf107f'
   })
  .end(function(err, res){
    var temp = res.body.main.temp - 273.15;
    console.log(temp + '℃');
  });
