import { Position, PositionSnapshot, Pool, Result } from '../interfaces/positions';
import GraphQueries from '../api/graph/queries';
import { Service } from 'typedi';
import Api from '../api/exApi';
import { Container } from 'typedi';
// ----------- external class ----------
const api = Container.get(Api);

// ---------- constents ----------
const TICK_BASE = 1.0001;

@Service()
export default class Positions {
  //
  // --------------- Main or Starter function ---------------------//
  async compute(userAddress: string | any) {
    try {
      const positions = await this.findPositionsByUserAddress(userAddress);
      if (positions.length === 0) {
        return { message: 'faild', result: [] };
      }

      let results: Result[] = [];
      for (const i in positions) {
        let position = positions[i];
        const { adjestedAmount0, adjestedAmount1 } = await this.findCurrentAmount(position);
        const { token0Price, token1Price } = await this.findCurrentPrices(position.token0.id, position.token1.id);
        console.log('Token 0 price', token0Price);
        console.log('Token 1 price', token1Price);
        let v1 = adjestedAmount0 * token0Price + adjestedAmount1 * token1Price;
        let vint =
          parseFloat(position.withdrawnToken0) * token0Price + parseFloat(position.withdrawnToken1) * token1Price;
        let v_withdraw = v1 + vint;
        let v_held =
          parseFloat(position.depositedToken0) * token0Price + parseFloat(position.depositedToken1) * token1Price;

        let impeloss = ((v_withdraw - v_held) / v_held) * 100;
        console.log(impeloss);
        let result: Result = {
          pool: `${position.token0.symbol}/${position.token1.symbol}`,
          loss: impeloss,
        };

        results.push(result);
      }

      return { message: 'success', result: results };
    } catch (e) {
      console.log(e.message);
    }
  }

  // ----------------- Helpers -------------------------//

  tickToPrice(tick: number) {
    return TICK_BASE ** tick;
  }
  // returns current token amounts in pool w
  async findCurrentAmount(position: Position): Promise<{ adjestedAmount0: number; adjestedAmount1: number }> {
    let liquidity = parseFloat(position.liquidity);
    let tickerLower = parseFloat(position.tickLower.tickIdx);
    let tickerUpper = parseFloat(position.tickUpper.tickIdx);
    let poolId = position.pool.id;

    let token0 = position.token0.symbol;
    let token1 = position.token1.symbol;
    let decimals0 = parseInt(position.token0.decimals);
    let decimals1 = parseInt(position.token1.decimals);

    const pools = await this.findPoolById(poolId);
    if (pools.length == 0) {
      throw Error('No pool found');
    }

    let pool = pools[0];

    let currentTick = parseFloat(pool.tick);

    let currentSqrtPrice = parseFloat(pool.sqrtPrice) / 2 ** 96;
    let sa = this.tickToPrice(tickerLower / 2);
    let sb = this.tickToPrice(tickerUpper / 2);
    let amount0;
    let amount1;

    // pool tokens amounts
    if (tickerUpper <= currentTick) {
      amount0 = 0;
      amount1 = liquidity * (sb - sa);
    } else if (tickerLower < currentTick && currentTick < tickerUpper) {
      amount0 = ((liquidity * (sb - currentSqrtPrice)) / currentSqrtPrice) * sb;
      amount1 = liquidity * (currentSqrtPrice - sa);
    } else {
      amount0 = (liquidity * (sb - sa)) / (sa * sb);
      amount1 = 0;
    }

    let adjestedAmount0 = amount0 / 10 ** decimals0;
    let adjestedAmount1 = amount1 / 10 ** decimals1;

    const lowerTickerPrice = this.tickToPrice(tickerLower);
    const upperTickerPrice = this.tickToPrice(tickerUpper);
    const lowerTickPriceAdjested = lowerTickerPrice * 10 ** (decimals0 - decimals1);
    const upperTickerAdjested = upperTickerPrice * 10 ** (decimals0 - decimals1);
    console.log(
      `  position ${position.id} in range [${lowerTickPriceAdjested},${upperTickerAdjested}]: ${adjestedAmount0} ${token0} and ${adjestedAmount1} ${token1} at the current price`,
    );

    return { adjestedAmount0, adjestedAmount1 };
  }
  // find current trading price of pool tokens using external api!!!
  async findCurrentPrices(address1: string, address2: string): Promise<{ token0Price: number; token1Price }> {
    let token0Price = await api.getPrice(address1);
    let token1Price = await api.getPrice(address2);

    return { token0Price, token1Price };
  }

  // ------------------- Query ------------------//

  // query user open positions
  async findPositionsByUserAddress(userAddress: string): Promise<Position[]> {
    let positions = await GraphQueries.getPositionsByUserAddress(userAddress);
    return positions;
  }

  // fetching current pool
  async findPoolById(id: string): Promise<Pool[]> {
    let pools = await GraphQueries.getPoolById(id);
    return pools;
  }
}
