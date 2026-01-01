import { RouteService } from './route.service';
export declare class RouteController {
    private readonly routeService;
    constructor(routeService: RouteService);
    getUserRoutes(req: any): Promise<{
        routes: any[];
        home: string;
    }>;
    getConstantRoutes(): Promise<never[]>;
    isRouteExist(routeName: string): Promise<boolean>;
}
