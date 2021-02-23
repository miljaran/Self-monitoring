import { addMorning } from "../../services/reportService.js";
import { nullable, isDate, validate, required, isNumeric, numberBetween } from "../../deps.js";

const getMorning = async(request, session) => {
  const data = {
    date: "",
    sleepDuration: "",
    sleepQuality: "",
    mood: "",
    user: await session.get('user'),
    errors: {}
  };

  if (request) {
    const body = request.body();
    const params = await body.value;

    if (params.get('date') != "") {
      data.date = params.get('date');
    } else {
      const today = new Date().toISOString();
      data.date = today.substring(0, 10);
    }

    data.sleepDuration = Number(params.get('sleepDuration'));
    data.sleepQuality = Number(params.get('sleepQuality'));
    data.mood = Number(params.get('mood'));
  }
  return data;
}

const showMorningForm = async({render, session}) => {
  render('morningReport.ejs', await getMorning(null, session));
}

const validationRules = {
  date: [nullable, isDate],
  sleepDuration: [required, numberBetween(0, 24)],
  sleepQuality: [required, numberBetween(1, 5)],
  mood: [required, numberBetween(1, 5)]
}

const messages = {
  messages: {
    "date.isDate": "Date must be in the right format",
    "sleepDuration.required": "Duration of sleep is required",
    "sleepDuration.numberBetween": "Duration of sleep must be between 0 and 24 hours",
    "sleepQuality.numberBetween": "Quality of sleep is required",
    "mood.numberBetween": "Generic mood is required",
  }
}

const submitMorningForm = async({ request, response, render, session }) => {
  const data = await getMorning(request, session);
  const [passes, errors] = await validate(data, validationRules, messages);

  if (!passes) {
    data.errors = errors;
    render('morningReport.ejs', data);
  } else {
    await addMorning(data.user.id, data.date, data.sleepDuration, data.sleepQuality, data.mood);
    response.redirect('/behavior/reporting');
  }
};

export { showMorningForm, submitMorningForm }
