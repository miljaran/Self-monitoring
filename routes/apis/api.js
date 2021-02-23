import * as service from "../../services/averageService.js";

const weekSummary = async({ response }) => {
  response.body = (await service.avgAllWeek())[0];
}

const daySummary = async({response, params}) => {
  const date = `${params.year}-${params.month}-${params.day}`;
  response.body = (await service.avgAllDay(date))[0];
}

export { weekSummary, daySummary }
