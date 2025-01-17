import { expect } from "chai";

import hydrationData from "../src/data/hydration-data";
import  HydrationRepository from "../src/HydrationRepository"



describe("Hydration Repository Class", function () {
  let hydrationRepo;
  
  beforeEach(function () {
    hydrationRepo = new HydrationRepository(hydrationData);
  });
  it("should be a function", function () {
    expect(HydrationRepository).to.be.a("function");
  });
  it("should make an an instance of Hydration", function () {
    expect(hydrationRepo).to.be.an.instanceOf(HydrationRepository);
  });
  it("should hold all hydration data", function () {
    expect(hydrationRepo.allHydrationData).to.equal(hydrationData);
  });
  it("should give hydration data for a specific user", function () {
   
    const user10 = [
  { userID: 10, date: '2019/06/15', numOunces: 75 },
  { userID: 10, date: '2019/06/16', numOunces: 68 },
  { userID: 10, date: '2019/06/17', numOunces: 49 },
  { userID: 10, date: '2019/06/18', numOunces: 97 },
  { userID: 10, date: '2019/06/19', numOunces: 38 },
  { userID: 10, date: '2019/06/20', numOunces: 78 },
  { userID: 10, date: '2019/06/21', numOunces: 95 },
  { userID: 10, date: '2019/06/22', numOunces: 72 },
  { userID: 10, date: '2019/06/23', numOunces: 58 }
]
    expect(hydrationRepo.filterHydrationByUser(10)).to.deep.equal(user10);
  });
  it("should give a user's hydration data for the latest date", function () {
    const user10Today = { userID: 10, date: '2019/06/23', numOunces: 58 }
    
    expect(hydrationRepo.findTodaysHydration(10)).to.deep.equal(user10Today);
  });
  it("should give the user's hydration data for the week", function () {
    const weeklyHydrations = [
  { userID: 10, date: '2019/06/16', numOunces: 68 },
  { userID: 10, date: '2019/06/17', numOunces: 49 },
  { userID: 10, date: '2019/06/18', numOunces: 97 },
  { userID: 10, date: '2019/06/19', numOunces: 38 },
  { userID: 10, date: '2019/06/20', numOunces: 78 },
  { userID: 10, date: '2019/06/21', numOunces: 95 },
  { userID: 10, date: '2019/06/22', numOunces: 72 }
  ]
    expect(hydrationRepo.findWeeklyHydration("2019/06/22", 10)).to.deep.equal(weeklyHydrations);
  });
  it("should calculate a user's average hydration for all time", function () {
    expect(hydrationRepo.getAverageHydration(10)).to.equal(70);
  });
});
