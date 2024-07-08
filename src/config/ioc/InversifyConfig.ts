import 'reflect-metadata';
import { Container } from 'inversify';
//import { buildProviderModule, fluentProvide } from 'inversify-binding-decorators';

// import AuthController from '../auth/controllers/AuthController2';
import MongoDB from '../database/MongoDB';

// // Create container
const container = new Container({ autoBindInjectable: true, defaultScope: 'Singleton'}); // if use autoBindInjectable, defaultScope, then no need to use @provide and container.bind
// container.bind(AuthController).to(AuthController);

// If use @provided at before each class, then no need to use container.bind()
//container.bind(Redis).toSelf().inSingletonScope();
//container.bind(Redis).to(Redis);

// For configuration, mean not injected anywhere in project, just run constructor once, 
// same as @Configuration in Java Spring Boot
container.resolve(MongoDB);

// Automatically load and bind all providers decorated with @provide()
//container.load(buildProviderModule());

export default container;
