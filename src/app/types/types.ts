export interface FetchResponse<T> {
  result: T | null | undefined;
  error: { code: number; message: string } | null | undefined;
}

export interface IBalanceInfo {
  currency: string;
  free_balance: number;
  lock_out_balance: number;
  lock_in_balance: number;
  lock_orders: number;
  user_balance: number;
  user_balance_base_equ: number;
}

type AdrTxStateEnum = (typeof AdrTxStateEnum)[keyof typeof AdrTxStateEnum];
const AdrTxStateEnum = {
  None: 0,
  Draft: 1,
  AmlConfirm: 2,
  SendedToModule: 4,
  SendedToNetwork: 8,
  NetworkIn: 16,
  NetworkConfirmed: 32,
  HasInnerTransaction: 64,
  Cancelation: 1 << 11,
  Finished: 1 << 13,
} as const;

type OriginalStatus = (typeof OriginalStatus)[keyof typeof OriginalStatus];
const OriginalStatus = {
  None: 0,
  Successful: 1,
  Rejected: 2,
  FailedReverted: 3,
  FailedOutOfEnergy: 4,
  Failed: 5,
  FailedOutOfGas: 6,
  completed: 110,
  pending: 111,
  cancelled: 112,
} as const;

type TransactTypeEnum =
  (typeof TransactTypeEnum)[keyof typeof TransactTypeEnum];
const TransactTypeEnum = {
  None: 0,
  InnerTransfer: 1,
  ExchnageToBroker: 2,
  Income: 3,
  Outcome: 4,
  FromBank: 5,
  ToBank: 6,
  CreateInvest: 7,
  CloseInvest: 8,
  EarlyCloseInvest: 9,
  PaymentInvest: 10,
  InternalTx: 11,
  InternalTxConfirm: 12,
  InvoiceTx: 13,
  InvoiceTxConfirm: 14,
  OrderReturnBalance: 15,
  OrderCreate: 16,
  AgentPayment: 17,
  RewardPayment: 18,
  ExchnageFromBroker: 20,
  CrossProjectSelfTransfer: 21,
  SwapToBroker: 22,
  SwapFromBroker: 23,
} as const;

type TransactStateEnum =
  (typeof TransactStateEnum)[keyof typeof TransactStateEnum];
const TransactStateEnum = {
  None: 0,
  WithdrawCreated: 1,
  NetworkConfirmed: 2,
  NetworkUnConfirmed: 4,
  FromNetwork: 6,
  AMLSended: 8,
  Blocked: 16,
  Canceled: 32,
  Failed: 64,
  Finished: 128,
} as const;

interface AddressTxData {
  address_from?: string | null;
  address_to?: string | null;
  block_num?: string | null;
  original_state?: OriginalStatus;
  state?: AdrTxStateEnum;
  token_network?: string | null;
  tx_hash?: string | null;
}
export interface IAppData {
  crc32hash?: string | null;
  datetime?: string | null;
  file_id?: string;
  filename?: string | null;
  filesize?: number;
  url?: string | null;
}
export interface ITransaction {
  address_tx_data?: AddressTxData;
  amount?: string | null;
  balance?: number;
  currency?: string | null;
  datetime?: string;
  update_datetime?: string;
  external_id?: string;
  fee?: string | null;
  group?: string;
  id_transaction?: string | null;
  is_income?: boolean;
  next_key?: string | null;
  partner_info?: string | null;
  result_amount?: number;
  status?: TransactStateEnum;
  status_text?: string | null;
  tag?: string | null;
  tx_type?: TransactTypeEnum;
  tx_type_text?: string | null;
}

type CodeTypeEnum = (typeof CodeTypeEnum)[keyof typeof CodeTypeEnum];

export const CodeTypeEnum = {
  None: 0,
  RoomKey: 1,
  AgentLink: 2,
  AgentPayLink: 3,
  ClientInvestPayLink: 4,
  ClientRegPayLink: 5,
  FriendLink: 6,
  WalletCode: 7,
  CrmClientCode: 8,
  InternalTx: 11,
  InternalTxConfirm: 12,
  InvoiceTx: 13,
  InvoiceTxConfirm: 14,
  DiscountPoints: 15,
  DiscountPercent: 16,
  RaffleCode: 17,
  PrivateChat: 20,
  GroupChat: 21,
  InfoChannelChat: 22,
  PaymentOrder: 24,
} as const;

export interface TxCodesOut {
  amount?: number;
  code?: string | null;
  currency?: string | null;
  dateCodeUTC?: string | null;
  dateTxUTC?: string;
  externalId?: string;
  isOwner?: boolean;
  partnerInfo?: string | null;
  readonly state?: string | null;
  stateCode?: number;
  tag?: string | null;
  typeTx?: CodeTypeEnum;
}

export interface TxCodeInfo {
  timetick: number,
  code: string,
  currency: string,
  typeTx: number,
  amount: number,
  state: string,
  stateCode: number,
  dateTxUTC: string;
  dateCodeUTC: string,
  isOwner: boolean,
  externalId: string,
  partnerInfo: string,
  tag: string
}

type CategoryEnum = (typeof CategoryEnum)[keyof typeof CategoryEnum];

const CategoryEnum = {
  NUMBER_0: 0,
} as const;

type AppsFlag = (typeof AppsFlag)[keyof typeof AppsFlag];
const AppsFlag = {
  None: 0,
  Draft: 1,
  Pending: 2,
  Approved: 4,
  Declined: 8,
  HotIcon: 16,
  NewIcon: 32,
  BestIcon: 64,
  OpenInExternalBrowser: 128,
  AddAuthParameter: 256,
  Visible: 512,
  Deleted: 1073741824,
} as const;

interface CategoryData {
  category_id?: CategoryEnum;
  /** @nullable */
  category_name?: string | null;
  position?: number;
}

export interface AppsStoreOut {
  /** @nullable */
  categories?: CategoryData[] | null;
  category_id?: CategoryEnum;
  /** @nullable */
  developer?: string | null;
  flags?: AppsFlag;
  /** @nullable */
  full_name?: string | null;
  /**
   * DEPRECATED! use telegram_link and url_id
   * @nullable
   */
  game_link?: string | null;
  large_img?: string;
  medium_img?: string;
  /** @nullable */
  name?: string | null;
  position?: number;
  small_img?: string;
  /** @nullable */
  telegram_link?: string | null;
  timetick?: string;
  url_id?: string;
}
