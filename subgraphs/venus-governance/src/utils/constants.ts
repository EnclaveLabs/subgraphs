import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const BIGINT_ZERO = BigInt.fromI32(0);
export const BIGINT_ONE = BigInt.fromI32(1);
export const BIGDECIMAL_ZERO = new BigDecimal(BIGINT_ZERO);
export const STATUS_PENDING = 'PENDING';
export const STATUS_CANCELLED = 'CANCELLED';
export const STATUS_EXECUTED = 'EXECUTED';
export const STATUS_QUEUED = 'QUEUED';
export const STATUS_ACTIVE = 'ACTIVE';
