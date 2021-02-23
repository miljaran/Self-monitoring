import { Router } from "../deps.js";
import { showEveningForm, submitEveningForm } from "./controllers/eveningController.js";
import { showMorningForm, submitMorningForm } from "./controllers/morningController.js";
import { showLoginForm, postLoginForm, logout, showRegistrationForm, postRegistrationForm } from "./controllers/authController.js";
import { showLanding, showReporting, showSummary } from "./controllers/averagesController.js";
import * as api from "./apis/api.js";

const router = new Router();

router.get('/', showLanding);
router.get('/auth/login', showLoginForm);
router.post('/auth/login', postLoginForm);
router.get('/auth/registration', showRegistrationForm);
router.post('/auth/registration', postRegistrationForm);
router.get('/auth/logout', logout);

router.get('/behavior/reporting/morning', showMorningForm);
router.post('/behavior/reporting/morning', submitMorningForm);
router.get('/behavior/reporting/evening', showEveningForm);
router.post('/behavior/reporting/evening', submitEveningForm);
router.get('/behavior/reporting', showReporting)
router.get('/behavior/summary', showSummary);

router.get('/api/summary', api.weekSummary)
router.get('/api/summary/:year/:month/:day', api.daySummary);

export { router };
