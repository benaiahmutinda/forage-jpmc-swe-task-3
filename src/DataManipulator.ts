import { ServerRespond } from "./DataStreamer";

export interface Row {
  price_abc: number;
  price_def: number;
  ratio: number;
  upper_bound: number;
  lower_bound: number;
  timestamp: Date;
  trigger_alert: number | undefined;
}

export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    const priceABC =
      (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF =
      (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    const upperBound = 1 + 0.1;
    const lowerBound = 1 - 0.1; // +/- 10% of the 12 month historical average ratio
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio: ratio,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      timestamp:
        serverRespond[0].timestamp > serverRespond[1].timestamp
          ? serverRespond[0].timestamp
          : serverRespond[1].timestamp, // Get the required timestamps
      trigger_alert:
        ratio > upperBound || ratio < lowerBound ? ratio : undefined, // Only trigger the alert if we breach the bounds
    };
  }
}
