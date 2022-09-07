import uniswapV3Setting from './uniswapV3Settings.json';
import { request, gql } from 'graphql-request';

const SUBGRAPH_URL = uniswapV3Setting.uniGraphEndPoint;
export default class GraphQueries {
  // get all open positions
  static async getUserOpenPositions(userAddress: string) {
    const query = gql`
      {
        positions(where: { owner: "${userAddress}",liquidity_gt:0 }) {
          owner
          id
          liquidity
          collectedFeesToken0
          collectedFeesToken1
          depositedToken0
          depositedToken1
          withdrawnToken0
          withdrawnToken1
          tickLower {
            price0
            price1
            tickIdx
          }
          tickUpper {
            price0
            price1
            tickIdx
          }

          transaction {
            mints {
              sender
              owner
              amountUSD
            }
            burns {
              owner
              amount
            }
            collects {
              owner
              amount0
              amountUSD
            }
          }
          pool {
            totalValueLockedUSD
            totalValueLockedToken0
            totalValueLockedToken1
            liquidity
            sqrtPrice
            token0Price
            token1Price
          }
          token0 {
            id
            symbol
            name
            decimals
            derivedETH
          }
          token1 {
            id
            symbol
            name
            decimals
            derivedETH
          }
        }
      }
    `;
    const response = await request(SUBGRAPH_URL, query);

    const userPositions = response?.positions;
    return userPositions;
  }

  // get all user position snapshots
  static async getUserPositionSnapShots(userAddress: String) {
    const query = gql`
    {
      positionSnapshots(where:{owner:"${userAddress}",liquidity_gt:0}){
        id,
        owner,
        position {
          owner
          id
          liquidity
          collectedFeesToken0
          collectedFeesToken1
          depositedToken0
          depositedToken1
          withdrawnToken0
          withdrawnToken1
          tickLower {
            price0
            price1
          }
          tickUpper {
            price0
            price1
          }

          transaction {
            mints {
              sender
              owner
              amountUSD
            }
            burns {
              owner
              amount
            }
            collects {
              owner
              amount0
              amountUSD
            }
          }
          pool {
            totalValueLockedUSD
            totalValueLockedToken0
            totalValueLockedToken1
            liquidity
            sqrtPrice
            token0Price
            token1Price
          }
          token0 {
            id
            symbol
            name
            decimals
            derivedETH
          }
          token1 {
            id
            symbol
            name
            decimals
            derivedETH
          }
        }
      }
    }
    `;

    const response = await request(SUBGRAPH_URL, query);

    const userPositionSnapShots = response?.positionSnapshots;
    return userPositionSnapShots;
  }

  static async getPositionsById(nftId: string) {
    const query = gql`
      {
        positions(where: {id: ${nftId}}) {
          liquidity
          tickLower { tickIdx }
          tickUpper { tickIdx }
          pool { id }
          token0 {
            symbol
            decimals
          }
          token1 {
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
      pools(where: {id: ${id}}) {
        tick
        sqrtPrice
      }
    }
    `;

    const response = await request(SUBGRAPH_URL, query);
    const pools = response?.pools;
    return pools;
  }
}
