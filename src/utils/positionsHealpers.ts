import { Postion, PositionSnapshot } from '../interfaces/positions';
import GraphQueries from '../api/graph/queries';
import { Service } from 'typedi';
@Service()
export default class Positions {
  constructor() {}
  async fetchUserPositions(userAddress: string): Promise<Postion[]> {
    let positions = await GraphQueries.getUserOpenPositions(userAddress);
    return positions;
  }
  async fetchUserPositionSnapShots(userAddress: string, nftId: string): Promise<PositionSnapshot[]> {
    let positionsSnapshot = await GraphQueries.getUserPositionSnapShots(userAddress);
    return positionsSnapshot;
  }

  async compute(userAddress: string) {
    let positions = await this.fetchUserPositions(userAddress);
    if (positions.length == 0) {
      return { message: 'no open positions' };
    }

    // for (let index in positions) {
    //   console.log(index);
    let hodling = this.currentLiquidationsCalculator(positions[1]);
    // }
  }

  currentLiquidityValue(position: Postion) {
    let liquidityContribution = position.liquidity / position.pool.liquidity;
    let userToken0Prop = position.pool.totalValueLockedToken0 * liquidityContribution;
    let userToken1Prop = position.pool.totalValueLockedToken1 * liquidityContribution;

    let token0HoldingsValue = userToken0Prop * position.pool.token0Price;
    let token1HoldingsValue = userToken1Prop * position.pool.token1Price;
    let userHoldingUSD = token0HoldingsValue + token1HoldingsValue;

    return userHoldingUSD;
  }

  valueIfNoLiquidityProvided() {}

  async currentLiquidationsCalculator(position: Postion) {
    console.log(position);
    let data = await this.fetchUserPositionSnapShots(position.owner, position.id);
    let filteredData = data.filter((e) => e.id.startsWith(`${position.id}#`));
    filteredData.forEach((e: PositionSnapshot) => {
      console.log(e.position);
    });

    let L = position.pool.liquidity;

    let P = position.pool.token0Price;

    let p_a = Math.sqrt(position.tickLower.tickIdx);
    let p_b = Math.sqrt(position.tickUpper.tickIdx);
  }
}
