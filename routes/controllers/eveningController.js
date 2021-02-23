import { addEvening } from "../../services/reportService.js";
import { validate, required, isNumeric, numberBetween, isDate, nullable } from "../../deps.js";

const getEvening = async(request, session) => {
  const data = {
    date: "",
    sportsTime: "",
    studyTime: "",
    eating: "",
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

    data.sportsTime = Number(params.get('sportsTime'));
    data.studyTime = Number(params.get('studyTime'));
    data.eating = Number(params.get('eating'));
    data.mood = Number(params.get('mood'));
  }
  return data;
}

const showEveningForm = async({render, session}) => {
  render('eveningReport.ejs', await getEvening(null, session));
}

const validationRules = {
  date: [nullable, isDate],
  sportsTime: [required, isNumeric, numberBetween(0, 24)],
  studyTime: [required, isNumeric, numberBetween(0, 24)],
  eating: [required, numberBetween(1, 5)],
  mood: [required, numberBetween(1, 5)]
}

const messages = {
  messages: {
    "date.isDate": "Date must be in the right format",
    "sportsTime.required": "Time spent on sports and exercise is required",
    "sportsTime.numberBetween": "Time spent on sports and exercise must be between 0 and 24 hours",
    "studyTime.required": "Time spent studying is required",
    "studyTime.numberBetween": "Time spent studying must be between 0 and 24 hours",
    "eating.numberBetween": "Regularity and quality of eating is required",
    "mood.numberBetween": "Generic mood is required",
  }
}

const submitEveningForm = async({ request, response, render, session }) => {
  const data = await getEvening(request, session);
  const [passes, errors] = await validate(data, validationRules, messages);

  if (!passes) {
    data.errors = errors;
    render('eveningReport.ejs', data);
  } else {
    await addEvening(data.user.id, data.date, data.sportsTime, data.studyTime, data.eating, data.mood);
    response.redirect('/behavior/reporting');
  }
};

export { showEveningForm, submitEveningForm}
