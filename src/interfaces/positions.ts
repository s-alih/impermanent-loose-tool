export interface Postion {
  id: string;
  owner: string;
  liquidity: number;
  token0: Token;
  token1: Token;
  pool: Pool;
  tickLower: Tick;
  tickUpper: Tick;
}

export interface PositionSnapshot {
  id: string;
  owner: string;
  position: Postion;
}

export interface Token {
  symbol: string;
  name: string;
}

export interface Tick {
  price0: number;
  price1: number;
  tickIdx: number;
}

export interface Pool {
  id: string;
  liquidity: number;
  totalValueLockedToken0: number;
  totalValueLockedToken1: number;
  token0Price: number;
  token1Price: number;
  sqrtPrice: number;
}
