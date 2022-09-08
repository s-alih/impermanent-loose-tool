import { Position, PositionSnapshot, Pool } from '../interfaces/positions';
import GraphQueries from '../api/graph/queries';
import { Service } from 'typedi';
import Api from '../api/exApi';
import { Container } from 'typedi';

const api = Container.get(Api);
const TICK_BASE = 1.0001;
@Service()
export default class Positions {
  // async fetchUserPositions(userAddress: string): Promise<Postion[]> {
  //   let positions = await GraphQueries.getUserOpenPositions(userAddress);
  //   return positions;
  // }
  async fetchUserPositionSnapShots(userAddress: string): Promise<PositionSnapshot[]> {
    let positionsSnapshot = await GraphQueries.getUserPositionSnapShots(userAddress);
    return positionsSnapshot;
  }

  // async compute(userAddress: string) {
  //   let positions = await this.fetchUserPositions(userAddress);
  //   if (positions.length == 0) {
  //     return { message: 'no open positions' };
  //   }

  //   // for (let index in positions) {
  //   //   console.log(index);
  //   let hodling = this.currentLiquidationsCalculator(positions[1]);
  //   // }
  // }

  // currentLiquidityValue(position: Postion) {
  //   let liquidityContribution = position.liquidity / position.pool.liquidity;
  //   let userToken0Prop = position.pool.totalValueLockedToken0 * liquidityContribution;
  //   let userToken1Prop = position.pool.totalValueLockedToken1 * liquidityContribution;

  //   let token0HoldingsValue = userToken0Prop * position.pool.token0Price;
  //   let token1HoldingsValue = userToken1Prop * position.pool.token1Price;
  //   let userHoldingUSD = token0HoldingsValue + token1HoldingsValue;

  //   return userHoldingUSD;
  // }

  // valueIfNoLiquidityProvided() {}

  // async currentLiquidationsCalculator(position: Postion) {
  //   console.log(position);
  //   let data = await this.fetchUserPositionSnapShots(position.owner, position.id);
  //   let filteredData = data.filter((e) => e.id.startsWith(`${position.id}#`));
  //   filteredData.forEach((e: PositionSnapshot) => {
  //     console.log(e.position);
  //   });

  //   let L = position.pool.liquidity;

  //   let P = position.pool.token0Price;

  //   let p_a = Math.sqrt(position.tickLower.tickIdx);
  //   let p_b = Math.sqrt(position.tickUpper.tickIdx);
  // }

  async findPositionsByUserAddress(userAddress: string): Promise<Position[]> {
    let positions = await GraphQueries.getPositionsByUserAddress(userAddress);
    return positions;
  }
  async findPoolById(id: string): Promise<Pool[]> {
    let pools = await GraphQueries.getPoolById(id);
    return pools;
  }

  tickToPrice(tick: number) {
    return TICK_BASE ** tick;
  }

  // async computeHeldValue(userAddress: string) {
  //   let positions = await this.findPositionsByUserAddress(userAddress);
  //   // let filteredData = data.filter((e) => e.id.startsWith(`${position.id}#`));
  //   let totalValue = 0;
  //   for (let index in positions) {
  //     let position = positions[index];
  //     let pool = await this.findPoolById(position.pool.id);
  //     let liquidityContribution = position.liquidity / pool[0].liquidity;
  //     let userToken0Prop = pool[0].totalValueLockedToken0 * liquidityContribution;
  //     let userToken1Prop = pool[0].totalValueLockedToken1 * liquidityContribution;

  //     let token0HoldingsValue = userToken0Prop * pool[0].token0Price;
  //     let token1HoldingsValue = userToken1Prop * pool[0].token1Price;
  //     let userHoldingUSD = token0HoldingsValue + token1HoldingsValue;
  //     totalValue += userHoldingUSD;
  //   }
  //   return totalValue;
  // }

  // async computeStartValue(userAddress, positionId) {
  //   try {
  //     console.log('--------------start value-----------------');
  //     const snapshots = await this.fetchUserPositionSnapShots(userAddress);
  //     let filteredData = snapshots.filter((e) => e.id.startsWith(`${positionId}#`));

  //     let position = filteredData[0].position;
  //     // console.log(position);

  //     let liquidity = filteredData[0].liquidity;
  //     let tickerLower = position.tickLower.tickIdx;
  //     let tickerUpper = position.tickUpper.tickIdx;
  //     // console.log(tickerLower, tickerUpper);
  //     let poolId = position.pool.id;

  //     let token0 = position.token0.symbol;
  //     let token1 = position.token1.symbol;
  //     let decimals0 = position.token0.decimals;
  //     let decimals1 = position.token1.decimals;

  //     // const pools = await this.findPoolById(poolId);
  //     // if (pools.length == 0) {
  //     //   return { message: 'No pools found' };
  //     // }

  //     let pool = filteredData[0].pool;
  //     // console.log('Pool', pool);

  //     let currentTick = pool.tick;

  //     let currentSqrtPrice = pool.sqrtPrice / 2 ** 96;

  //     let currentPrice = this.tickToPrice(currentTick);

  //     let adjestedCurrentPrice = currentPrice / 10 ** (decimals1 - decimals0);
  //     console.log(`Current price=${adjestedCurrentPrice} ${token1} for ${token0} at tick ${currentTick}`);
  //     let sa = this.tickToPrice(tickerLower / 2);
  //     let sb = this.tickToPrice(tickerUpper / 2);
  //     let amount0;
  //     let amount1;
  //     if (tickerUpper <= currentTick) {
  //       amount0 = 0;
  //       amount1 = liquidity * (sb - sa);
  //     } else if (tickerLower < currentTick && currentTick < tickerUpper) {
  //       amount0 = ((liquidity * (sb - currentSqrtPrice)) / currentSqrtPrice) * sb;
  //       amount1 = liquidity * (currentSqrtPrice - sa);
  //     } else {
  //       amount0 = (liquidity * (sb - sa)) / (sa * sb);
  //       amount1 = 0;
  //     }

  //     let adjestedAmount0 = amount0 / 10 ** decimals0;
  //     let adjestedAmount1 = amount1 / 10 ** decimals1;

  //     const lowerTickerPrice = this.tickToPrice(tickerLower);
  //     const upperTickerPrice = this.tickToPrice(tickerUpper);
  //     const lowerTickPriceAdjested = lowerTickerPrice * 10 ** (decimals0 - decimals1);
  //     const upperTickerAdjested = upperTickerPrice * 10 ** (decimals0 - decimals1);

  //     console.log(
  //       `  position ${position.id} in range [${lowerTickPriceAdjested},${upperTickerAdjested}]: ${adjestedAmount0} ${token0} and ${adjestedAmount1} ${token1} at the current price`,
  //     );

  //     let v1 = adjestedAmount0 + adjestedAmount1 * adjestedCurrentPrice;

  //     console.log(`start value of your liquidity position is ${v1}`);

  //     return v1;
  //   } catch (e) {
  //     console.log(e.message);
  //   }
  // }

  async findCurrentAmount(position: Position) {
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
      return { message: 'No pools found' };
    }

    let pool = pools[0];
    // console.log('Pool', pool);

    let currentTick = parseFloat(pool.tick);

    let currentSqrtPrice = parseFloat(pool.sqrtPrice) / 2 ** 96;

    let currentPrice = this.tickToPrice(currentTick);

    let adjestedCurrentPrice = currentPrice / 10 ** (decimals1 - decimals0);
    console.log(`Current price=${adjestedCurrentPrice} ${token1} for ${token0} at tick ${currentTick}`);
    let sa = this.tickToPrice(tickerLower / 2);
    let sb = this.tickToPrice(tickerUpper / 2);
    let amount0;
    let amount1;
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
  }

  async compute(userAddress: string | any) {
    try {
      const positions = await this.findPositionsByUserAddress(userAddress);
      if (positions.length === 0) {
        return { message: 'No Open Positions Found!' };
      }
      console.log('Found some positions', positions.length);

      let position = positions[0];

      for (const i in positions) {
      }
      // console.log(position);

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
        return { message: 'No pools found' };
      }

      let pool = pools[0];
      // console.log('Pool', pool);

      let currentTick = parseFloat(pool.tick);

      let currentSqrtPrice = parseFloat(pool.sqrtPrice) / 2 ** 96;

      let currentPrice = this.tickToPrice(currentTick);

      let adjestedCurrentPrice = currentPrice / 10 ** (decimals1 - decimals0);
      console.log(`Current price=${adjestedCurrentPrice} ${token1} for ${token0} at tick ${currentTick}`);
      let sa = this.tickToPrice(tickerLower / 2);
      let sb = this.tickToPrice(tickerUpper / 2);
      let amount0;
      let amount1;
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
      console.log(position.token0.id, position.token1.id);
      let token0Price = await api.getPrice(position.token0.id);
      let token1Price = await api.getPrice(position.token1.id);
      // console.log('token0Price', token0Price, 'token1Price', token1Price);

      // console.log('token 0 price', pool.token0Price, 'token1 price', pool.token1Price);
      console.log(
        `  position ${position.id} in range [${lowerTickPriceAdjested},${upperTickerAdjested}]: ${adjestedAmount0} ${token0} and ${adjestedAmount1} ${token1} at the current price`,
      );
      // console.log(position);
      let v1 = adjestedAmount0 * token0Price + adjestedAmount1 * token1Price;
      console.log('v1', v1);
      let vint =
        parseFloat(position.withdrawnToken0) * token0Price + parseFloat(position.withdrawnToken1) * token1Price;

      // console.log(
      //   'adjested amout 0',
      //   adjestedAmount0,
      //   'adjested amount 1',
      //   adjestedAmount1,
      //   '\ndeposited token 0',
      //   position.depositedToken0,
      //   'deposted token 1',
      //   position.depositedToken1,
      //   '\nwithdrawn token 0',
      //   position.withdrawnToken0,
      //   'withdrawn token 1',
      //   position.withdrawnToken1,
      // );

      let v_withdraw = v1 + vint;
      console.log('v withdraw', v_withdraw);

      let v_held =
        parseFloat(position.depositedToken0) * token0Price + parseFloat(position.depositedToken1) * token1Price;
      console.log('v held', v_held);

      let impeloss = ((v_withdraw - v_held) / v_held) * 100;

      console.log(impeloss);

      console.log(`current value of your liquidity positions is ${v1}`);

      // await this.computeStartValue(userAddress, position.id);

      return v1;
    } catch (e) {
      console.log(e.message);
    }
  }
}
