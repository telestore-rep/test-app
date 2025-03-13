import { EventSource } from "eventsource";

let _eventSource: EventSource | null = null;

export const setEventSource = (eventSource: EventSource) => _eventSource = eventSource;


