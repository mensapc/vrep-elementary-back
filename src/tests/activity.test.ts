import * as dotenv from 'dotenv'
dotenv.config();
import mongoose from 'mongoose';
import request from 'supertest'
import Activity from '../activities/models/activityModel';
const connectDB = require('../../config/db.js');
import app from '../../app'
import { response } from 'express';

describe('Activity API', () => {
    beforeAll(async() => {
        await connectDB(process.env.MONGODB_URL);
    });

    afterAll(async() => {
        await mongoose.connection.close();
    });

    beforeEach(async() => {
        await Activity.deleteMany({});
    })

    test('should create a activity', async () => {
        const response = await request(app)
        .post('/api/v1/activities').send({message:'Test by noam'})

        expect(response.status).toBe(201);
    })

    test('should get all activities', async () => {
        // First, create an activity
        await request(app)
            .post('/api/v1/activities')
            .send({ message: 'Test by noam' });

        // Then, get all activities
        const response = await request(app).get('/api/v1/activities');

        expect(response.status).toBe(200);
    });

    test('should delete an activity', async () => {
        const createResponse = await request(app).post('/api/v1/activities').send({message:'Test2 by noam'});
        const activtyId = createResponse.body._id;
        const deleteResponse = await request(app).delete(`/api/v1/activities/${activtyId}`);

        expect(deleteResponse.status).toBe(204);
    })

    test('should update an activity', async () => {
        const createResponse = await request(app).post('/api/v1/activities').send({message:'Test3 by noam'});
        const activtyId = createResponse.body._id;
        const updateResponse = await request(app).put(`/api/v1/activities/${activtyId}`).send({message:'activity updates'});
        
        expect(updateResponse.status).toBe(200);
    })  
})