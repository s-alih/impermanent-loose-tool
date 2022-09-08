import uniswapV3Setting from './uniswapV3Settings.json';
import { request, gql } from 'graphql-request';

const SUBGRAPH_URL = uniswapV3Setting.uniGraphEndPoint;
export default class GraphQueries {
  static async getPositionsByUserAddress(userAddress: string) {
    const query = gql`
      {
        positions(where: { owner: "${userAddress}",liquidity_gt:0 }) {
          id
          liquidity
          tickLower { tickIdx }
          tickUpper { tickIdx }
          depositedToken0
          depositedToken1
          withdrawnToken0
          withdrawnToken1
          pool { id }
          token0 {
            id
            symbol
            decimals
          }
          token1 {
            id
            symbol
            decimals
          }
        }
      }
      `;
    const response = await request(SUBGRAPH_URL, query);

    const position = response?.positions;
    return position;
  }

  static async getPoolById(id: string) {
    const query = gql`
    {
      pools(where: {id: "${id}"}) {
        tick
        sqrtPrice
        token0Price
        token1Price
      }
    }
    `;

    const response = await request(SUBGRAPH_URL, query);
    const pools = response?.pools;
    return pools;
  }
}
