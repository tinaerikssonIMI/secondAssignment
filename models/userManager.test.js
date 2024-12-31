const UserManager = require('./UserManager');
const UserDatabase = require('./UserDatabase');

jest.mock('./UserDatabase');

describe('UserManager', () => {
  let userManager;

  beforeEach(() => {
    userManager = new UserManager();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('register should throw error if username is taken', async () => {
    UserDatabase.findUser.mockResolvedValue({ username: 'testuser' });

    await expect(userManager.register('testuser', 'Test@1234')).rejects.toThrow('Användarnamnet är redan upptaget.');
  });

  test('register should throw error if password is too weak', async () => {
    UserDatabase.findUser.mockResolvedValue(null);

    await expect(userManager.register('testuser', 'weak')).rejects.toThrow('Lösenordet måste innehålla minst 8 tecken,\nvarav minst en stor bokstav, en siffra och ett specialtecken.');
  });

  test('register should save user if username is available and password is strong', async () => {
    UserDatabase.findUser.mockResolvedValue(null);
    UserDatabase.saveUser.mockResolvedValue({ username: 'testuser' });

    await expect(userManager.register('testuser', 'Test@1234')).resolves.toEqual({ username: 'testuser' });
  });

  test('login should throw error if user does not exist', async () => {
    UserDatabase.findUser.mockResolvedValue(null);

    await expect(userManager.login('testuser', 'Test@1234')).rejects.toThrow('Användaren finns inte.');
  });

  test('login should throw error if password is incorrect', async () => {
    UserDatabase.findUser.mockResolvedValue({ username: 'testuser', password: 'WrongPassword' });

    await expect(userManager.login('testuser', 'Test@1234')).rejects.toThrow('Fel lösenord.');
  });

  test('login should return user if credentials are correct', async () => {
    UserDatabase.findUser.mockResolvedValue({ username: 'testuser', password: 'Test@1234' });

    await expect(userManager.login('testuser', 'Test@1234')).resolves.toEqual({ username: 'testuser', password: 'Test@1234' });
  });
});