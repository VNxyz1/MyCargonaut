import { TripRequestOffering } from '../../../interfaces/TripRequestOffering.ts';
import { TransitRequest } from '../../../interfaces/TransitRequest.ts';
import { create } from 'zustand';

type Store = {
  incomingOfferings: TripRequestOffering[]
  sentOfferings: TripRequestOffering[]
  incomingTransitRequests: TransitRequest[]
  sentTransitRequests: TransitRequest[]
  setIncomingOfferings: (tro: TripRequestOffering[]) => void
  setSentOfferings: (tro: TripRequestOffering[]) => void
  setIncomingTransitRequests: (tr: TransitRequest[]) => void
  setSentTransitRequests: (tr: TransitRequest[]) => void
}

export const reqAndOffStore = create<Store>()((set) => ({
  incomingOfferings: [],
  sentOfferings: [],
  incomingTransitRequests: [],
  sentTransitRequests: [],
  setIncomingOfferings: (tro) => set(()=> ({incomingOfferings: tro})),
  setSentOfferings: (tro) => set(()=> ({sentOfferings: tro})),
  setIncomingTransitRequests: (tr) => set(()=> ({incomingTransitRequests: tr})),
  setSentTransitRequests: (tr) => set(()=> ({sentTransitRequests: tr})),
}));