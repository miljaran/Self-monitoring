import { avgToday, avgYesterday, avgWeek, avgMonth } from "../../services/averageService.js";
import { searchMorning, searchEvening } from "../../services/reportService.js";

const showSummary = async({render, session}) => {
  const user = (await session.get('user'));
  const week = await avgWeek(user.id);
  console.log(week)
  const month = await avgMonth(user.id);
  render('summary.ejs', { week: week, month: month, user: user })
}

const showLanding = async({render, session}) => {
  const user = await session.get('user');

  render('landing.ejs', { today: await avgToday(), yesterday: await avgYesterday(), user: user});
}

const showReporting = async({session, render}) => {
  const user = await session.get('user');

  const today = new Date();
  const todayStr = today.toISOString().substring(0, 10);

  const morning = await searchMorning(user.id, todayStr);
  const evening = await searchEvening(user.id, todayStr);

  render('report.ejs', { morning: morning, evening: evening, user: user });
}

export { showLanding, showReporting, showSummary };
