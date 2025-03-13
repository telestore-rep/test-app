import { Queue } from "../lib/queue";

export const webhookStorage = new Queue<string>(100);
export const sseStorage = new Queue<string>(100);
