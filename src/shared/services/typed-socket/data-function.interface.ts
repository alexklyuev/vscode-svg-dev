export interface DataFunction<X, Y = X> {
    (value: X): Y;
}
