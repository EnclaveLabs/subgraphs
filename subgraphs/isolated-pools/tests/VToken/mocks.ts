import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { createMockedFunction } from 'matchstick-as';

import { poolRegistryAddress } from '../../src/constants/addresses';

// type PoolsArray = [name: string, creator: Address, comptroller: Address, blockPosted: BigInt, timestampPosted: BigInt][];

const priceOracleMock = Address.fromString('0x0000000000000000000000000000000000000000');

export const createPoolRegistryMock = (pools: Array<Array<ethereum.Value>>): void => {
  pools.forEach((pool, idx): void => {
    const tupleArray: Array<ethereum.Value> = [
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(idx)),
      pool[0],
      pool[1],
      pool[2],
      pool[3],
      pool[4],
    ];
    const tuple = changetype<ethereum.Tuple>(tupleArray);
    const tupleValue = ethereum.Value.fromTuple(tuple);

    createMockedFunction(
      poolRegistryAddress,
      'getPoolByID',
      'getPoolByID(uint256):((uint256,string,address,address,uint256,uint256))',
    )
      .withArgs([ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(idx))])
      .returns([tupleValue]);
  });
};

export const createVBep20AndUnderlyingMock = (
  contractAddress: Address,
  underlyingAddress: Address,
  comptrollerAddress: Address,
  name: string,
  symbol: string,
  decimals: BigInt,
  reserveFactorMantissa: BigInt,
  interestRateModelAddress: Address,
): void => {
  // vBep20
  createMockedFunction(contractAddress, 'underlying', 'underlying():(address)').returns([
    ethereum.Value.fromAddress(underlyingAddress),
  ]);

  createMockedFunction(contractAddress, 'name', 'name():(string)').returns([
    ethereum.Value.fromString(`Venus ${name}`),
  ]);

  createMockedFunction(contractAddress, 'symbol', 'symbol():(string)').returns([
    ethereum.Value.fromString(`v${symbol}`),
  ]);

  createMockedFunction(
    contractAddress,
    'interestRateModel',
    'interestRateModel():(address)',
  ).returns([ethereum.Value.fromAddress(interestRateModelAddress)]);

  createMockedFunction(
    contractAddress,
    'reserveFactorMantissa',
    'reserveFactorMantissa():(uint256)',
  ).returns([ethereum.Value.fromUnsignedBigInt(reserveFactorMantissa)]);

  createMockedFunction(contractAddress, 'comptroller', 'comptroller():(address)').returns([
    ethereum.Value.fromAddress(comptrollerAddress),
  ]);

  // Underlying
  createMockedFunction(underlyingAddress, 'decimals', 'decimals():(uint8)').returns([
    ethereum.Value.fromUnsignedBigInt(decimals),
  ]);
  createMockedFunction(underlyingAddress, 'name', 'name():(string)').returns([
    ethereum.Value.fromString(name),
  ]);
  createMockedFunction(underlyingAddress, 'symbol', 'symbol():(string)').returns([
    ethereum.Value.fromString(symbol),
  ]);
};

export const createMarketMock = (marketAddress: Address): void => {
  createMockedFunction(
    marketAddress,
    'accrualBlockNumber',
    'accrualBlockNumber():(uint256)',
  ).returns([ethereum.Value.fromI32(999)]);

  createMockedFunction(marketAddress, 'totalSupply', 'totalSupply():(uint256)').returns([
    ethereum.Value.fromUnsignedBigInt(BigInt.fromI64(36504567163409)),
  ]);

  createMockedFunction(
    marketAddress,
    'exchangeRateStored',
    'exchangeRateStored():(uint256)',
  ).returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromI64(365045823500000000000000))]);

  createMockedFunction(marketAddress, 'borrowIndex', 'borrowIndex():(uint256)').returns([
    ethereum.Value.fromUnsignedBigInt(BigInt.fromI64(300000000000000000000)),
  ]);

  createMockedFunction(marketAddress, 'totalReserves', 'totalReserves():(uint256)').returns([
    ethereum.Value.fromUnsignedBigInt(BigInt.fromI64(5128924555022289393)),
  ]);

  createMockedFunction(marketAddress, 'totalBorrows', 'totalBorrows():(uint256)').returns([
    ethereum.Value.fromUnsignedBigInt(BigInt.fromI64(2641234234636158123)),
  ]);

  createMockedFunction(marketAddress, 'getCash', 'getCash():(uint256)').returns([
    ethereum.Value.fromUnsignedBigInt(BigInt.fromI64(1418171344423412457)),
  ]);

  createMockedFunction(
    marketAddress,
    'borrowRatePerBlock',
    'borrowRatePerBlock():(uint256)',
  ).returns([ethereum.Value.fromI32(12678493)]);

  createMockedFunction(
    marketAddress,
    'supplyRatePerBlock',
    'supplyRatePerBlock():(uint256)',
  ).returns([ethereum.Value.fromI32(12678493)]);
};

// type Tokens = [address, price][]
export const createPriceOracleMock = (tokens: Array<Array<ethereum.Value>>): void => {
  tokens.forEach((token): void => {
    createMockedFunction(
      priceOracleMock,
      'getUnderlyingPrice',
      'getUnderlyingPrice(address):(uint256)',
    )
      .withArgs([token[0]])
      .returns([token[1]]);
  });
};