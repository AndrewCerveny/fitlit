
import "../src/css/styles.css";
import "../src/images/turing-logo.png";
import "../src/images/exercise.png";
import "../src/images/friends.png";
import "../src/images/intro.jpg";
import "../src/images/sleeping.png";
import "../src/images/water.png";
import UserRepository from "./UserRepository";
import getAPIData from "./apiCalls";
import User from "./User";
import Hydration from "./Hydration";
import HydrationRepository from "./HydrationRepository";
import Sleep from "./Sleep.js";
import SleepRepository from "./SleepRepository";
import dayjs from "dayjs";
import Activity from "./Activity"
import ActivityRepository from "./ActivityRepository"


let allUserData;
let allSleepData;
let allHydroData;
let allActivityData;
let userRepository;
let currentUser;
let currentUserID;
let sleepRepository;
let hydrationRepository;
let dateForWeek;
let activityRepository;



const userAPI = 'http://localhost:3001/api/v1/users';
const sleepAPI = 'http://localhost:3001/api/v1/sleep';
const hydrationAPI = 'http://localhost:3001/api/v1/hydration';
const activityAPI = 'http://localhost:3001/api/v1/activity';


function getPageData() {
  Promise.all([
    getAPIData(userAPI),
    getAPIData(sleepAPI),
    getAPIData(hydrationAPI),
    getAPIData(activityAPI)
  ])
    .then((response) => {
      allUserData = response[0].userData;
      allSleepData = response[1].sleepData;
      allHydroData = response[2].hydrationData;
      allActivityData = response[3].activityData;
      createClassInstances(allUserData, allSleepData, allHydroData, allActivityData);
      getRandomUser(allUserData);
      restrictCalendarRangeMin();
    })
    .catch((error) => {
      fetchFailureDisplay.classList.remove('hidden');
    });
};


const hydrationBtn = document.querySelector("#hydration");
const hydrationDisplay = document.querySelector(".hydration-widget");
const toggleHomeBtn = document.querySelector(".back-home");
const ouncesDrankToday = document.getElementById("todaysOz");
const calendarSub = document.getElementById("dateInput");
const calendarDate = document.getElementById("calendar");
const hydrationWeeklyAvg = document.getElementById("weeklyAvg");
const hydroAllTimeAvgArea = document.getElementById("allTimeAvg");
const welcomeContainer = document.getElementById("user-info");
const stepsWidget = document.getElementById("steps-widget");
const stepsButton = document.getElementById("steps");
const userFriendsSection = document.getElementById("friends-info");
const returnStepsWidgetButton = document.getElementById("return-to-widget");
const sleepWidgetButton = document.getElementById("sleep");
const sleepWidget = document.getElementById("sleep-widget");
const returnSleepWidgetButton = document.getElementById("return-to-sleep-widget");
const fetchFailureDisplay = document.getElementById('fetch-failure');
const postFailureDisplay = document.getElementById('post-failure');


hydrationBtn.addEventListener("click",function() {
  showHydrationArea();
  displayHydrationDom();
});
toggleHomeBtn.addEventListener("click", (event) => {
  returnToWidget(event, hydrationBtn, toggleHomeBtn, hydrationDisplay);
});
window.addEventListener("load", function(){
  getPageData();
});
stepsButton.addEventListener("click", updateStepWidget);
returnStepsWidgetButton.addEventListener("click", (event) => {
  returnToWidget(event, stepsButton, stepsWidget, returnStepsWidgetButton);
});
sleepWidgetButton.addEventListener("click", updateSleepData);
returnSleepWidgetButton.addEventListener("click", (event) => {
  returnToWidget(event, sleepWidgetButton, sleepWidget, returnSleepWidgetButton)
});
calendarSub.addEventListener('click',displayWeeklyAverage);
;
calendarDate.addEventListener('mousedown',enableSubmit) 



function createClassInstances(dataSet1, dataSet2, dataSet3, dataSet4) {
  allUserData = dataSet1.map((user) => new User(user));
  userRepository = new UserRepository(allUserData);
  allSleepData = dataSet2.map((data) => new Sleep(data));
  sleepRepository = new SleepRepository(allSleepData);
  allHydroData = dataSet3.map(data => new Hydration(data));
  hydrationRepository = new HydrationRepository(allHydroData);
  allActivityData = dataSet4.map(data => new Activity(data));
  activityRepository = new ActivityRepository(allActivityData);
};

function getRandomUser(allUserData) {
  const randomID = Math.floor(Math.random() * allUserData.length);
  currentUser = allUserData[randomID];
  currentUserID = allUserData[randomID].id;
  updateUserInfo();
  updateFriendsInfo();
  return currentUserID;
};

function updateUserInfo() {
  welcomeContainer.innerHTML = `
  <h1 class="user-name">Welcome, ${currentUser.firstName()}!</h1>
  <h2 class="user-info">${currentUser.address}, ${currentUser.email}</h2>`;
};

function updateFriendsInfo() {
  allUserData[currentUserID].friends.forEach((friend) => {
    userFriendsSection.innerHTML += `<div class="user-friends" id="friend">
      <h2>${userRepository.findUser(friend).name}</h2><br>
      <h3>Step Goal: ${userRepository.findUser(friend).dailyStepGoal}</h3>
    </div>`;
  });
};

function showHydrationArea() {
	showArea(hydrationBtn,toggleHomeBtn,hydrationDisplay);
};

function displayHydrationDom() {
 displayTodaysHydration(hydrationRepository,currentUserID);
 displayAverageConsumed();
};

function restrictCalendarRangeMin() {
  const usersRecordedDates = hydrationRepository.filterHydrationByUser(currentUserID);
  const min = usersRecordedDates.sort((a,b)=> new Date(a.date) - new Date(b.date));
  const minDateEdit = min[0].date;
  const minValue = minDateEdit.replaceAll('/','-');
  const max = min.reverse()[0].date;
  const maxValue = max.replaceAll('/','-');
  calendarDate.setAttribute('max',maxValue);
  calendarDate.setAttribute('min',minValue);
};

function displayTodaysHydration(hydrationRepository,currentUserID) {
  const todaysOz = hydrationRepository.findTodaysHydration(currentUserID);
	ouncesDrankToday.innerText = `Today's you drank ${todaysOz} oz! `;
};

function displayWeeklyAverage(e) {
  e.preventDefault();
  hydrationWeeklyAvg.innerHTML = '';
	const chosenDate = calendarDate.value; 
	const alteredDate = chosenDate.replaceAll('-',"/");
	const userWeeklyData = hydrationRepository.findWeeklyHydration(alteredDate,currentUserID);
	userWeeklyData.forEach((recordedDay) => {
		hydrationWeeklyAvg.innerHTML += 
    `<p class="hydration-weekly">
		  ${dayjs(recordedDay.date).format('dd/MMM/D/YYYY')} you consumed ${recordedDay.numOunces} ounces
		</p>`;
	});
  calendarSub.disabled = true;
};

function displayAverageConsumed() {
  const averageWaterAllTime = hydrationRepository.getAverageHydration(currentUserID);
  const roundedAverage = Math.trunc(averageWaterAllTime);
  hydroAllTimeAvgArea.innerText = `All time average oz consumed is ${roundedAverage} oz !`;
};

function updateStepWidget() {
  showArea(stepsButton,stepsWidget,returnStepsWidgetButton);
  const userActivity = activityRepository.filterById(currentUserID);
  const todayActivity = activityRepository.determineTodayData();
  const userStepsToday = todayActivity.numSteps;
  const userMinActiveToday = todayActivity.minutesActive;
  const userStairsClimbed = todayActivity.flightsOfStairs;
  const numOfMiles = activityRepository.findMilesWalked(todayActivity.date, currentUser);
  const avgSteps = activityRepository.getUsersAvgForDay(todayActivity.date, 'numSteps');
  const avgMinActive = activityRepository.getUsersAvgForDay(todayActivity.date, 'minutesActive');
  const avgStairsClimbed = activityRepository.getUsersAvgForDay(todayActivity.date, 'flightsOfStairs');




  stepsWidget.innerHTML = `<ul> 
      <li>Stride Length: ${currentUser.strideLength} </li>
      <li> Today's Steps: ${userStepsToday} </li>
      <li> Your Activity For Today: ${userMinActiveToday} minutes </li>
        <ul>
          <li> Your Activity vs Avg of All Users Activity </li>
          <li> Steps Activity: ${userStepsToday} vs ${avgSteps} </li>
          <li> Minutes Activity: ${userMinActiveToday} vs ${avgMinActive} </li>
          <li> Stairs Climbed: ${userStairsClimbed} vs ${avgStairsClimbed} </li>
        </ul>
      <li> Miles Walked Today: ${numOfMiles} miles </li>
      <li>Your Daily Step Goal: ${
        currentUser.dailyStepGoal
      } Steps<br>Average Step Goal for All Users: ${userRepository.calculateAverageStepGoal()} Steps</li>
    </ul>`;
};

function returnToWidget(event, area1, area2, area3) {
  event.preventDefault();
  hideArea(area1, area2, area3);
};

function showArea(area1, area2, area3) {
  area1.classList.add("hidden");
  area2.classList.remove("hidden");
  area3.classList.remove("hidden");
};

function hideArea(area1, area2, area3) {
  area1.classList.remove('hidden');
  area2.classList.add('hidden');
  area3.classList.add('hidden');
};

function updateSleepData() {
  showArea(sleepWidgetButton, sleepWidget, returnSleepWidgetButton);
  sleepWidget.innerHTML = `
          <ul class=widget>
            <li>Hours Slept Today: ${
              sleepRepository.findTodaysData(currentUserID).hoursSlept
            }</li>
            <li>Sleep Quality for Today: ${
              sleepRepository.findTodaysData(currentUserID).sleepQuality
            }</li>
            <li>Hours Slept for the Week: ${findLatestWeeksSleepData(
              currentUserID,
              "hoursSlept"
            )}</li>
            <li>Sleep Quality for the Week: ${findLatestWeeksSleepData(
              currentUserID,
              "sleepQuality"
            )}</li>
            <li>Your All Time Hours Slept Average: ${displayAverageSleepDataForAllTime(
              "hoursSlept"
            )} hours</li>
            <li>Your All Time Sleep Quality Average: ${displayAverageSleepDataForAllTime(
              "sleepQuality"
            )}</li>
          </ul>
          `;
};

function findLatestWeeksSleepData(id, type) {
  dateForWeek = sleepRepository.findTodaysData(id).date;
  let dataForWeek = sleepRepository.calculateSleepPerWeek(dateForWeek, id);
  let dataResult = dataForWeek.reduce((acc, cur, index) => {
    acc.push(` ${cur.date}: ${cur[type]} `);
    return acc;
  }, []);
  return dataResult;
};

function displayAverageSleepDataForAllTime(type) {
  return sleepRepository.calcAvgSleepStats(type);
};

function enableSubmit() { 
  calendarSub.disabled = false;
};