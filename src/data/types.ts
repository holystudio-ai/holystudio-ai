export interface PolicySection {
    id: number;
    title: string;
    text: string;
}

export interface PolicyData {
    title: string;
    sections: PolicySection[];
}