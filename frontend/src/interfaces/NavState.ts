export interface NavState {
  redirected?: boolean;
  type?: number;
}

export enum RedirectType {
  offer,
  request
}