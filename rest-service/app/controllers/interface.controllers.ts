import { Router } from 'express';

export abstract class RouteController {
  abstract router: Router;
  abstract getRoutes(): Router;
  protected init(): void {}
}