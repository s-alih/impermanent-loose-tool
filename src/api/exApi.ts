import fetch from 'node-fetch';
import { Service } from 'typedi';

@Service()
export default class Api {
  // -------------- fetching current price of token using moralis api -----------------
  async getPrice(tokenAddress: string) {
    const url = `https://deep-index.moralis.io/api/v2/erc20/${tokenAddress}/price?chain=eth`;
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-API-Key': '8EEoDF5EDCvBBMcWHTIAb0zFf2BUBc7C0It196STzC3aFGFld2eFyQsVqZztiEY2',
      },
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      return data.usdPrice;
    } catch (e) {
      console.log(e);
    }
  }
}
