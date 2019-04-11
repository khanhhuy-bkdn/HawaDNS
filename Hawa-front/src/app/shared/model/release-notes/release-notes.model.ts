export class ReleaseNotes {
    version: string;
    date: string;
    note: {
        status: string;
        content: string;
        numberCommit: number;
    }[];
}