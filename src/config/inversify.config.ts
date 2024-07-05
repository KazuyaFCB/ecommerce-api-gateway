import 'reflect-metadata';
import { Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';

// import AuthController from '../auth/controllers/AuthController2';
import MongoDB from './database/MongoDB2';

// // Create container
const container = new Container();
// container.bind(AuthController).to(AuthController);

// If use @provided at before each class, then no need to use container.bind()

// For configuration, mean not injected anywhere in project, just run constructor once, 
// same as @Configuration in Java Spring Boot
container.resolve(MongoDB);

// Automatically load and bind all providers decorated with @provide()
container.load(buildProviderModule());

export default container;
