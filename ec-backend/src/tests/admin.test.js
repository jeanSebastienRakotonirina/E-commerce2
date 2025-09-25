const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');

describe('Admin API', () => {
  let token;
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const user = new User({ email: 'admin@test.com', password: 'hashedpassword', isAdmin: true });
    await user.save();
    token = require('jsonwebtoken').sign({ id: user._id, isAdmin: true }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should get all users', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('x-auth-token', token);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});