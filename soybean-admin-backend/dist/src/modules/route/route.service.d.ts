import { MenuService } from '../menu/menu.service';
export declare class RouteService {
    private readonly menuService;
    constructor(menuService: MenuService);
    getUserRoutes(userId: string): Promise<{
        routes: any[];
        home: string;
    }>;
    getConstantRoutes(): Promise<never[]>;
    isRouteExist(_routeName: string): Promise<boolean>;
}
