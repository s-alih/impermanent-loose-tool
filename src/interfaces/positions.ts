export interface Position {
  id: string;
  owner: string;
  liquidity: string;
  token0: Token;
  token1: Token;
  pool: Pool;
  tickLower: Tick;
  tickUpper: Tick;
  depositedToken0: string;
  depositedToken1: string;
  withdrawnToken0: string;
  withdrawnToken1: string;
}

export interface PositionSnapshot {
  id: string;
  owner: string;
  position: Position;
  liquidity: string;
  pool: Pool;
}

export interface Token {
  id: string;
  symbol: string;
  name: string;
  decimals: string;
}

export interface Tick {
  price0: string;
  price1: string;
  tickIdx: string;
}

export interface Pool {
  id: string;
  liquidity: string;
  tick: string;
  totalValueLockedToken0: string;
  totalValueLockedToken1: string;
  token0Price: string;
  token1Price: string;
  sqrtPrice: string;
}
