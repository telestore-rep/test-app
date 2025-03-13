import { TeleStoreClient } from "@telestore/integration-sdk";
import { PRIVATE_USER_KEY } from "../constants/server";

export const teleStoreClient = new TeleStoreClient(PRIVATE_USER_KEY, true);
