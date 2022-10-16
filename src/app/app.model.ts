import { User } from "firebase/auth";

export interface SignUpUser extends User {
    dateCreation: number
}

export interface SignInUser extends User {
    dateEnter: number
}

export interface SignInfo {
    content: string | SignUpUser | SignInUser | null;
    isError: boolean;
}

export interface List {
    id: string;
    label: string;
    taskCount: number;
    createdData: string;
}

export interface ListTask {
    id: string;
    label: string;
    createdData: string;
    listId: string;
}