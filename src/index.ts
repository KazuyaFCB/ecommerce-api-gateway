import 'reflect-metadata';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import express from 'express';
import App from './app2';
import container from './config/inversify.config';

// Setup express app
const appInstance = new App();
appInstance.start();
