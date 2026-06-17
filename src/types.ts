export interface Product {
    id: number;
    title: string;
    price: number;
    category: string;
    description: string;
    image: string;
}

export interface IdleState {
    status: "idle";
}

export interface LoadingState {
    status: "loading";
}

export interface SuccessState {
    status: "success";
    data: Product[]; 
}

export interface ErrorState {
    status: "error";
    message: string; 
}

export type AppState = IdleState | LoadingState | SuccessState | ErrorState;