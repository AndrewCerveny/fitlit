import {expect} from 'chai';
import UserRepository from '../src/UserRepository';
import UserData from '../src/data/users';
import User from '../src/User'

describe('User Repository', () => {
  let userRepository;
  
  beforeEach(() => {
    userRepository = new UserRepository(UserData);
  });
  it('Should be a function', function () {
    expect(UserRepository).to.be.a('function');
  });
  it('Should be an instance of UserRepository',() => {
    expect(userRepository).to.be.an.instanceOf(UserRepository);
  });
  it('Should hold all of the user data', () => {
    expect(userRepository.allUsers).to.equal(UserData);
  });
  it('Should find a user based on their id', () => {
    expect(userRepository.findUser(1)).to.equal(UserData[0]);
    userRepository.findUser(1);
    expect(userRepository.currentUser).to.be.an.instanceOf(User);
  });
  it('Should find average step goal for all users', () => {
    expect(userRepository.calculateAverageStepGoal()).to.equal(6700);
  });
});