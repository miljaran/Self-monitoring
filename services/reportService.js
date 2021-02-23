import { executeQuery } from "../database/database.js";

const addMorning = async(id, date, sleepDuration, sleepQuality, mood) => {
  const exists = searchMorning(id, date);
  if (exists) {
    await executeQuery('DELETE FROM reports WHERE id = $1 AND date = $2 AND sleepDuration IS NOT NULL', id, date);
  }
  await executeQuery('INSERT INTO reports (id, date, sleepDuration, sleepQuality, mood) VALUES ($1, $2, $3, $4, $5);', id, date, sleepDuration, sleepQuality, mood);
}

const getMorning = async(request) => {
  const today = new Date();
  const todayStr = today.toISOString().substring(0, 10);

  const data = {
    date: todayStr,
    sleepDuration: '',
    sleepQuality: '',
    mood: '',
    errors: []
  };

  if (request) {
    const body = request.body();
    const params = await body.value;
    data.date = params.get('date');
    if (params.get('sleepDuration')) {
      data.sleepDuration = Number(params.get('sleepDuration'));
    }
    if (params.get('sleepQuality')) {
      data.sleepQuality = Number(params.get('sleepQuality'));
    }
    if (params.get('mood')) {
      data.mood = Number(params.get('mood'));
    }
  }

  return data;
};

const searchMorning = async(id, date) => {
  const res = await executeQuery("SELECT * FROM reports WHERE id = $1 AND date = $2 AND sleepDuration IS NOT NULL", id, date);
  if (!res) {
    return null;
  }
  return res.rowsOfObjects()[0];
}

const addEvening = async(id, date, sportsTime, studyTime, eating, mood) => {
  const exists = searchEvening(id, date);
  if (exists) {
    await executeQuery('DELETE FROM reports WHERE id = $1 AND date = $2 AND sportsTime IS NOT NULL', id, date);
  }
  await executeQuery('INSERT INTO reports (id, date, sportsTime, studyTime, eating, mood) VALUES ($1, $2, $3, $4, $5, $6);', id, date, sportsTime, studyTime, eating, mood)
}

const getEvening = async(request) => {
  const today = new Date();
  const todayStr = today.toISOString().substring(0, 10);

  const data = {
    date: todayStr,
    sportsTime: '',
    studyTime: '',
    eating: '',
    mood: '',
    errors: []
  };

  if (request) {
    const body = request.body();
    const params = await body.value;
    data.date = params.get('date');
    if (params.get('sportsTime')) {
      data.sportsTime = Number(params.get('sportsTime'));
    }
    if (params.get('studyTime')) {
      data.studyTime = Number(params.get('studyTime'));
    }
    if (params.get('eating')) {
      data.eating = Number(params.get('eating'));
    }
    if (params.get('mood')) {
      data.mood = Number(params.get('mood'));
    }
  }

  return data;
};

const searchEvening = async(id, date) => {
  const res = await executeQuery("SELECT * FROM reports WHERE id = $1 AND date = $2 AND sportsTime IS NOT NULL", id, date);
  if (res.rowCount === 0) {
    return null;
  }
  return res.rowsOfObjects()[0];
}

export { addMorning, addEvening, getMorning, getEvening, searchMorning, searchEvening }
