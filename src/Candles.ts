import axios, { AxiosResponse } from 'axios';

const binanceBaseUrl = 'https://api.binance.com/api/v3';

export interface CandlestickData {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  trades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
  ignore: string;
}

interface MinMaxResult {
  dimension: string;
  min: number;
  max: number;
}


// Define the candlestick data interface
interface CandlestickData {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  trades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
  ignore: string;
}

// Define the BinanceCandlestickFetcher class
export class BinanceCandlestickFetcher {
  private readonly baseUrl: string;

  constructor(apiKey: string, secretKey: string) {
    this.baseUrl = 'https://api.binance.com/api/v3';
    // Set up axios with your API keys
    // axios.defaults.headers.common['X-MBX-APIKEY'] = apiKey;
  }

  // Fetch historical candlestick data
  async fetchCandlestickData(
    symbol: string,
    interval: string,
    limit: number
    // startTime?: number,
    // endTime?: number
  ): Promise<CandlestickData[]> {
    try {
      const params: Record<string, any> = {
        symbol,
        interval,
        limit
      };

      // if (startTime) params.startTime = startTime;
      // if (endTime) params.endTime = endTime;
      if (limit) params.limit = limit;

      const response: AxiosResponse<CandlestickData[]> = await axios.get(
        `${this.baseUrl}/klines`,
        {
          params,
        }
      );

      return response.data.map((item: any) => ({
        openTime: item[0],
        open: item[1],
        high: item[2],
        low: item[3],
        close: item[4],
        volume: item[5],
        closeTime: item[6],
        quoteAssetVolume: item[7],
        trades: item[8],
        takerBuyBaseAssetVolume: item[9],
        takerBuyQuoteAssetVolume: item[10],
        ignore: item[11],
      }));
    } catch (error) {
      throw new Error(`Failed to fetch candlestick data: ${error.message}`);
    }
  }
}


// Example usage of the fetchCandlestickData function
// async function main() {
//   const symbol = 'BTCUSDT'; // Replace with the desired trading pair
//   const interval = '1h';    // Replace with the desired interval (e.g., 1m, 5m, 1h, 1d)
//   const limit = 1000;       // The maximum number of data points you want to retrieve

//   try {
//     const candlestickData = await fetchCandlestickData(symbol, interval, limit);
//     console.log(candlestickData);
//   } catch (error) {
//     console.error(error);
//   }
// }

// Call the example usage function
// main();
