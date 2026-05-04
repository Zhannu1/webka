const request = require('supertest');
const chai = require('chai');
const app = require('../server');
const sequelize = require('../config/database');
const expect = chai.expect;

describe('Job Portal API Tests', () => {

    before(async () => {
        // Тест алдында базаны синхрондау
        await sequelize.sync({ force: true });

        // Админ аккаунтын жасау (server.js-тегідей)
        const bcrypt = require('bcryptjs');
        const User = require('../models/User');
        const Vacancy = require('../models/Vacancy');

        await User.create({
            name: 'Admin',
            email: 'admin@jobportal.kz',
            password: await bcrypt.hash('admin123', 10),
            role: 'admin'
        });

        await Vacancy.create({
            title: 'Test Job',
            company: 'Test Co',
            salary: '100,000 ₸',
            phone: '+7 777 000 00 00',
            email: 'hr@test.com'
        });
    });
    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const user = {
                name: 'Test Mocha User',
                email: 'mocha@test.kz',
                password: 'password123'
            };
            const res = await request(app)
                .post('/api/auth/register')
                .send(user);

            expect(res.status).to.equal(201);
            expect(res.body).to.be.an('object');
            expect(res.body.message).to.equal('User registered');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login an existing user', async () => {
            const user = {
                email: 'admin@jobportal.kz',
                password: 'admin123'
            };
            const res = await request(app)
                .post('/api/auth/login')
                .send(user);

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('token');
            expect(res.body.user.email).to.equal('admin@jobportal.kz');
        });

        it('should not login with wrong password', async () => {
            const user = {
                email: 'admin@jobporta.kz',
                password: 'wrongpassword'
            };
            const res = await request(app)
                .post('/api/auth/login')
                .send(user);

            expect(res.status).to.equal(401);
            expect(res.body.error).to.equal('Invalid credentials');
        });
    });

    // Vacancy Tests
    describe('GET /api/vacancies', () => {
        it('should get all vacancies', async () => {
            const res = await request(app)
                .get('/api/vacancies');

            if (res.status !== 200) console.log('GET /vacancies Error:', res.body);
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.be.at.least(1);
        });
    });

    describe('POST /api/vacancies', () => {
        it('should create a new vacancy', async () => {
            const vacancy = {
                title: 'Mocha Test Job',
                company: 'Mocha Corp',
                salary: '500,000 ₸',
                phone: '+7 700 000 00 00',
                email: 'test@mocha.com'
            };
            const res = await request(app)
                .post('/api/vacancies')
                .send(vacancy);

            if (res.status !== 201) console.log('POST /vacancies Error:', res.body);
            expect(res.status).to.equal(201);
            expect(res.body).to.be.an('object');
            expect(res.body.title).to.equal('Mocha Test Job');
        });
    });

    // User Management Tests
    describe('GET /api/users', () => {
        it('should get all users', async () => {
            const res = await request(app)
                .get('/api/users');

            if (res.status !== 200) console.log('GET /users Error:', res.body);
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
        });
    });
});
