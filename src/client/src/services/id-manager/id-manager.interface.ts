export interface IdManager {
    new: string;
    last: string;
    except(ids: string[]): void;
    except(...ids: string[]): void;
}
