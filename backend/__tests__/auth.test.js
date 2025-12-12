import { jest } from '@jest/globals';

// --- MOCKS (Must use unstable_mockModule for ESM) ---

// 1. Mock 'User.js' (Default export)
jest.unstable_mockModule('../models/User.js', () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

// 2. Mock 'redis.js' (Named export)
jest.unstable_mockModule('../lib/redis.js', () => ({
  redis: {
    set: jest.fn(),
  },
}));

// 3. Mock 'jsonwebtoken' (Default export)
jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    sign: jest.fn(() => 'fake_token_string'),
  },
}));

// --- IMPORTS (Must happen AFTER the mocks using await import) ---
const { signup } = await import('../controllers/auth.js');
const User = (await import('../models/User.js')).default;
const { redis } = await import('../lib/redis.js');

// --- TESTS ---

describe('Auth Controller - Signup', () => {
  let req, res;

  beforeEach(() => {
    // Clear previous mock usage data
    jest.clearAllMocks();

    req = {
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      },
    };
    
    res = {
      status: jest.fn().mockReturnThis(), // Allow chaining .status().json()
      json: jest.fn(),
      cookie: jest.fn(),
    };
  });

  test('should create a new user and return 201 status if user does not exist', async () => {
    // A. SETUP: Tell the mocks what to return
    User.findOne.mockResolvedValue(null); // No user exists yet
    User.create.mockResolvedValue({
      _id: '12345',
      name: 'Test User',
      email: 'test@example.com',
      role: 'customer',
    });
    
    // B. EXECUTE: Run your actual signup function
    await signup(req, res);

    // C. VERIFY: Did it do what we expected?
    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(User.create).toHaveBeenCalled();
    expect(redis.set).toHaveBeenCalled(); 
    expect(res.cookie).toHaveBeenCalledTimes(2); 
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'User created successfully',
      })
    );
  });

  test('should return 400 if user already exists', async () => {
    // A. SETUP: Pretend the user ALREADY exists
    User.findOne.mockResolvedValue({ email: 'test@example.com' });

    // B. EXECUTE
    await signup(req, res);

    // C. VERIFY
    expect(User.create).not.toHaveBeenCalled(); 
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
  });

test('should return 500 if database fails', async () => {
    // A. SETUP: Make the database throw an error
    User.findOne.mockRejectedValue(new Error('Database explosion'));

    // B. EXECUTE
    await signup(req, res);

    // C. VERIFY
    expect(res.status).toHaveBeenCalledWith(500);
    
    // FIX: Just use the string 'Database explosion' directly
    expect(res.json).toHaveBeenCalledWith({ message: 'Database explosion' });
  });
});