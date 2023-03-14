import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';

import { VToken } from '../../generated/PoolRegistry/VToken';
import { VToken as VTokenContract } from '../../generated/PoolRegistry/VToken';
import {
  Account,
  AccountVToken,
  AccountVTokenTransaction,
  Auction,
  Market,
  Pool,
  RewardSpeed,
} from '../../generated/schema';
import {
  AUCTION_LARGE_POOL_DEBT,
  AUCTION_NOT_STARTED,
  AUCTION_STARTED,
  zeroBigDecimal,
  zeroBigInt32,
} from '../constants';
import {
  getAccountVTokenId,
  getAccountVTokenTransactionId,
  getAuctionId,
  getMarketId,
  getPoolId,
  getRewardSpeedId,
} from '../utilities/ids';
import { createAccount, createMarket, createPool } from './create';

export const getOrCreateMarket = (
  vTokenAddress: Address,
  comptrollerAddress: Address | null = null,
  blockTimestamp: BigInt = BigInt.fromI32(0),
): Market => {
  let market = Market.load(getMarketId(vTokenAddress));
  if (!market) {
    const vTokenContract = VTokenContract.bind(vTokenAddress);
    if (!comptrollerAddress) {
      comptrollerAddress = vTokenContract.comptroller();
    }
    market = createMarket(comptrollerAddress, vTokenAddress, blockTimestamp);
  }
  return market;
};

export const getOrCreatePool = (comptroller: Address): Pool => {
  let pool = Pool.load(getPoolId(comptroller));
  if (!pool) {
    pool = createPool(comptroller);
  }
  return pool;
};

export const getOrCreateAccount = (accountAddress: Address): Account => {
  let account = Account.load(accountAddress.toHexString());
  if (!account) {
    account = createAccount(accountAddress);
  }
  return account;
};

export const getOrCreateAccountVTokenTransaction = (
  accountAddress: Address,
  txHash: Bytes,
  timestamp: BigInt,
  block: BigInt,
  logIndex: BigInt,
  marketId: Address,
): AccountVTokenTransaction => {
  const accountVTokenTransactionId = getAccountVTokenTransactionId(
    accountAddress,
    txHash,
    logIndex,
  );
  let transaction = AccountVTokenTransaction.load(accountVTokenTransactionId.toString());

  if (transaction == null) {
    const accountVTokenId = getAccountVTokenId(marketId, accountAddress);
    transaction = new AccountVTokenTransaction(accountVTokenTransactionId);
    transaction.accountVToken = accountVTokenId;
    transaction.txHash = txHash;
    transaction.timestamp = timestamp;
    transaction.block = block;
    transaction.logIndex = logIndex;
    transaction.save();
  }

  return transaction;
};

export const getOrCreateAccountVToken = (
  marketSymbol: string,
  accountAddress: Address,
  marketAddress: Address,
  enteredMarket: boolean = false, // eslint-disable-line @typescript-eslint/no-inferrable-types
): AccountVToken => {
  const accountVTokenId = getAccountVTokenId(marketAddress, accountAddress);
  let accountVToken = AccountVToken.load(accountVTokenId);
  if (!accountVToken) {
    accountVToken = new AccountVToken(accountVTokenId);
    accountVToken.symbol = marketSymbol;
    accountVToken.account = accountAddress.toHexString();
    accountVToken.market = marketAddress.toHexString();
    accountVToken.enteredMarket = enteredMarket;
    accountVToken.accrualBlockNumber = zeroBigInt32;
    // we need to set an initial real onchain value to this otherwise it will never
    // be accurate
    const vTokenContract = VToken.bind(marketAddress);
    const accountSnapshot = vTokenContract.getAccountSnapshot(accountAddress);

    const suppliedAmountMantissa = accountSnapshot.value1;
    const borrowedAmountMantissa = accountSnapshot.value2;
    accountVToken.accountSupplyBalanceMantissa = suppliedAmountMantissa;
    accountVToken.accountBorrowBalanceMantissa = borrowedAmountMantissa;

    accountVToken.totalUnderlyingRedeemedMantissa = zeroBigDecimal;
    accountVToken.accountBorrowIndexMantissa = zeroBigInt32;
    accountVToken.totalUnderlyingRepaidMantissa = zeroBigDecimal;
  }
  return accountVToken;
};

export const getOrCreateRewardSpeed = (
  rewardsDistributorAddress: Address,
  marketAddress: Address,
): RewardSpeed => {
  const id = getRewardSpeedId(rewardsDistributorAddress, marketAddress);
  let rewardSpeed = RewardSpeed.load(id);
  if (!rewardSpeed) {
    rewardSpeed = new RewardSpeed(id);
    rewardSpeed.rewardsDistributor = rewardsDistributorAddress.toHexString();
    rewardSpeed.market = marketAddress.toHexString();
    rewardSpeed.borrowSpeedPerBlockMantissa = zeroBigInt32;
    rewardSpeed.supplySpeedPerBlockMantissa = zeroBigInt32;
    rewardSpeed.save();
  }
  return rewardSpeed;
};

export const getOrCreateAuction = (comptrollerAddress: Address): Auction => {
  const auctionId = getAuctionId(comptrollerAddress);
  let auction = Auction.load(auctionId);
  if (!auction) {
    auction = new Auction(auctionId);
    auction.status = AUCTION_NOT_STARTED;
    auction.type = AUCTION_LARGE_POOL_DEBT;
    auction.startBlock = zeroBigInt32;
    auction.seizedRiskFund = zeroBigInt32;
    auction.startBidBps = zeroBigInt32;
    auction.markets = [];
    auction.marketsDebt = [];
    auction.save();
  }
  return auction;
};
