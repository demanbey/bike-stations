const express = require("express");
const app = express();
const axios = require("axios");
var cors = require("cors");

app.use(cors());

app.get("/stations", async (req, res, next) => {
  const urlStatus = "https://api-core.bixi.com/gbfs/en/station_status.json";
  const urlInfo = "https://api-core.bixi.com/gbfs/en/station_information.json";

  const getResults = await Promise.all([
    axios
      .get(urlStatus)
      .then(response => response.data.data.stations)
      .catch(err => console.log(err)),
    axios
      .get(urlInfo)
      .then(response => response.data.data.stations)
      .catch(err => console.log(err))
  ]);

  const result = getResults[0].reduce((acc, crt) => {
    const stationId = crt["station_id"];
    const stationData = getResults[1].find(
      station => station["station_id"] === stationId
    );
    const fullData = {
      stationId: stationId,
      bikesAvailable: crt["num_bikes_available"],
      docksAavailable: crt["num_docks_available"],
      lat: stationData["lat"],
      lon: stationData["lon"]
    };

    acc.push(fullData);
    return acc;
  }, []);

  res.send(result);
});

app.listen(8000, () => {
  console.log("App running on port 8000");
});
