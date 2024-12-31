const UserDatabase = require('./UserDatabase');
const User = require('./User');

jest.mock('./User');

describe('UserDatabase', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  test('saveUser should save user successfully', async () => {
    User.create.mockResolvedValue({ username: 'testuser' });

    await expect(UserDatabase.saveUser('testuser', 'Test@1234')).resolves.not.toThrow();
  });

  test('saveUser should throw error if username is taken', async () => {
    User.create.mockRejectedValue({ name: 'SequelizeUniqueConstraintError' });

    await expect(UserDatabase.saveUser('testuser', 'Test@1234')).rejects.toThrow('Användarnamnet är redan upptaget.');
  });

  test('findUser should return user if found', async () => {
    User.findOne.mockResolvedValue({ username: 'testuser', password: 'Test@1234' });

    await expect(UserDatabase.findUser('testuser', 'Test@1234')).resolves.toEqual({ username: 'testuser', password: 'Test@1234' });
  });

  test('findUser should return null if user not found', async () => {
    User.findOne.mockResolvedValue(null);

    await expect(UserDatabase.findUser('testuser', 'Test@1234')).resolves.toBeNull();
  });

  test('updatePassword should update password if user exists', async () => {
    const user = { username: 'testuser', password: 'OldPassword', save: jest.fn() };
    User.findOne.mockResolvedValue(user);

    await expect(UserDatabase.updatePassword('testuser', 'NewPassword')).resolves.not.toThrow();
    expect(user.password).toBe('NewPassword');
    expect(user.save).toHaveBeenCalled();
  });

  test('updatePassword should throw error if user not found', async () => {
    User.findOne.mockResolvedValue(null);
    await expect(UserDatabase.updatePassword('testuser', 'NewPassword')).rejects.toThrow(new Error('Användaren hittades inte.'));
  });
});