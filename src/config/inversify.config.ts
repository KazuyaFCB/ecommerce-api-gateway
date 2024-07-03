import 'reflect-metadata';
import { Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import AuthService from '../auth/services/AuthService2';
import AuthController from '../auth/controllers/AuthController2';

// Create container
const container = new Container();
container.bind(AuthService).to(AuthService);
container.bind(AuthController).to(AuthController);

// Automatically load and bind all providers
container.load(buildProviderModule());

export default container;
