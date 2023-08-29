import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3005;

/* Interval times in milliseconds */
const TWO_MINUTES = 120000
const THREE_MINUTES = 180000;
const FOUR_MINUTES = 240000;
const SEVEN_MINUTES = 420000;

/* Set this to be however many days you want to increment to on subsequent requests */
const intervalChange = 25;

/* customer_tag */
app.get('/backfill/tags', (req, res) => {
  const baseRoute = `${process.env.ES_CONVERSION_URL}/customer_tag/writeExistingData`;
  const index = req?.query?.index;
  const fromDaysBack = Number(req?.query?.fromDaysBack);
  const toDaysBack = Number(req?.query?.toDaysBack);
  let interval = 0;

  if (index && isGuidValid(index) && fromDaysBack && toDaysBack) {
    res.json({msg: `Starting tags backfill for index ${index} and days back b/t ${fromDaysBack} & ${toDaysBack}`});

    performBackfill(`${baseRoute}?index=${index}&fromDaysBack=${fromDaysBack}&toDaysBack=${toDaysBack}`)

    const intervalId = setInterval(() => {
      interval += intervalChange;
      if ((fromDaysBack - interval) >= 0 && (fromDaysBack - interval) >= 0) {
        performBackfill(`${baseRoute}?index=${index}&fromDaysBack=${fromDaysBack - interval}&toDaysBack=${toDaysBack - interval}`);
      } else {
        console.log('Finished Backfilling! --> ' + new Date().toISOString());
        clearInterval(intervalId);
      }
    }, SEVEN_MINUTES)

  } else {
    res.status(400).json({error: 'None/Invalid index found'});
  }
})

/* customer_uphoria */
app.get('/backfill/uphorias', (req, res) => {
  const baseRoute = `${process.env.ES_CONVERSION_URL}/customer_uphoria/writeExistingData`;
  const index = req?.query?.indexes;
  const fromDaysBack = Number(req?.query?.fromDaysBack);
  const toDaysBack = Number(req?.query?.toDaysBack);
  let interval = 0;

  if (index && isGuidValid(index) && fromDaysBack && toDaysBack) {
    res.json({msg: `Starting uphorias backfill for index ${index} and days back b/t ${fromDaysBack} & ${toDaysBack}`});

    performBackfill(`${baseRoute}?indexes=${index}&fromDaysBack=${fromDaysBack}&toDaysBack=${toDaysBack}`);

    const intervalId = setInterval(() => {
      interval += intervalChange; 
      if ((fromDaysBack - interval) >= 0 && (fromDaysBack - interval) >= 0) {
        performBackfill(`${baseRoute}?indexes=${index}&fromDaysBack=${fromDaysBack - interval}&toDaysBack=${toDaysBack - interval}`);
      } else {
        console.log('Finished Backfilling! --> ' + new Date().toISOString());
        clearInterval(intervalId);
      }
    }, THREE_MINUTES)

  } else {
    res.status(400).json({error: 'None/Invalid index found'});
  }
})

const performBackfill = (url) => {
  try {
    console.log(`Performing backfill for => ${url} at ` + new Date().toISOString());
    axios.get(url, {headers: {Authorization: getAuth()}}); 
    axios.get(url, {headers: {Authorization: getAuth()}}); // Call it twice incase the first one fails.
  } catch(err) {
    console.error(`Error calling url ${url}.`);
    console.log(err);
  }
}

/* Validate index input */
const isHEX = (ch) => "0123456789abcdef".includes(ch.toLowerCase());
const isGuidValid = (guid) => {
  guid = guid.replaceAll("-", "");
  return guid.length === 32 && [...guid].every(isHEX);
};

/* es-conversion AUTH */
const getAuth = () => {
  const esConversionUsername = process.env.USERNAME;
  const esConversionPassword = process.env.PASSWORD;
  const authString = `${esConversionUsername}:${esConversionPassword}`;
  const encodedString = new Buffer.from(authString, 'utf8').toString('base64');
  return `Basic ${encodedString}`;
}

app.listen(PORT, () => console.log(`Express server Listening on PORT ${PORT}`));