import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'graph',
        loadComponent: () => 
            import('./components/graph/graph.component')
                .then(m => m.GraphComponent)
    }
];
