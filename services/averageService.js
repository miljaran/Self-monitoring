import { executeQuery } from "../database/database.js";

const avgWeek = async(id) => {
  const res = await executeQuery(`SELECT ROUND(AVG(sleepDuration)::numeric, 2) AS sleepDuration, ROUND(AVG(sportsTime)::numeric, 2) AS sportsTime,
  ROUND(AVG(studyTime)::numeric, 2) AS studyTime, ROUND(AVG(sleepQuality)::numeric, 2) AS sleepQuality, ROUND(AVG(mood)::numeric, 2) AS mood FROM reports
  WHERE date BETWEEN NOW() - INTERVAL '7 DAYS' AND NOW()`);
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects()[0];
  }
  return [];
}

const avgMonth = async(id) => {
  const res = await executeQuery(`SELECT ROUND(AVG(sleepDuration)::numeric, 2) AS sleepDuration, ROUND(AVG(sportsTime)::numeric, 2) AS sportsTime,
  ROUND(AVG(studyTime)::numeric, 2) AS studyTime, ROUND(AVG(sleepQuality)::numeric, 2) AS sleepQuality, ROUND(AVG(mood)::numeric, 2) AS mood FROM reports
  WHERE date BETWEEN NOW() - INTERVAL '30 DAYS' AND NOW()`);
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects()[0];
  }
  return [];
}

//api, toimii
const avgAllWeek = async() => {
  const res = await executeQuery(`SELECT ROUND(AVG(sportsTime)::numeric, 2) AS avgSports, ROUND(AVG(studyTime)::numeric, 2) AS avgStudy,
   ROUND(AVG(sleepDuration)::numeric, 2) AS avgSleepTime, ROUND(AVG(sleepQuality)::numeric, 2) AS avgSleepQuality, ROUND(AVG(mood)::numeric, 2) AS avgMood
  FROM reports WHERE date BETWEEN NOW() - INTERVAL '7 DAYS' AND NOW()`);
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects();
  }
  return [];
}

//api, toimii
const avgAllDay = async(date) => {
  const res = await executeQuery(`SELECT ROUND(AVG(sportsTime)::numeric, 2) AS avgSports, ROUND(AVG(studyTime)::numeric, 2) AS avgStudy,
   ROUND(AVG(sleepDuration)::numeric, 2) AS avgSleepTime, ROUND(AVG(sleepQuality)::numeric, 2) AS avgSleepQuality, ROUND(AVG(mood)::numeric, 2) AS avgMood
  FROM reports WHERE date = $1`, date);
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects();
  }
  return [];
}

// mood, toimii
const avgToday = async() => {
    const res = await executeQuery("SELECT ROUND(AVG(mood), 2) AS avg FROM reports WHERE date = CURRENT_DATE");
    if (res && res.rowCount > 0) {
        return res.rowsOfObjects()[0].avg;
      }
    return [];
}

// mood, toimii
const avgYesterday = async() => {
    const res = await executeQuery("SELECT ROUND(AVG(mood),1) AS avg FROM reports WHERE date = CURRENT_DATE-1");
    if (res && res.rowCount > 0) {
        return res.rowsOfObjects()[0].avg;
    }

    return [];
}

export { avgAllWeek, avgAllDay, avgToday, avgYesterday, avgWeek, avgMonth }
