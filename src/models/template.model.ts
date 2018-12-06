export interface Template {
    defaultDocument: string;
    render(doc: string): string;
}
