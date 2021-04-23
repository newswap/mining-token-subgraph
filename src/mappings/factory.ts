/* eslint-disable prefer-const */
import { log, EthereumBlock, BigInt } from '@graphprotocol/graph-ts'
import { TokenMineFactory, TokenMine } from '../types/schema'
import { Deploy } from '../types/Factory/Factory'
import {
  // FACTORY_ADDRESS,
  ZERO_BD,
  ZERO_BI,
  fetchTokenSymbol,
  fetchTokenName,
  fetchTokenDecimals,
  fetchPairToken0,
  fetchPairToken1
} from './helpers'

export function handleNewTokenMine(event: Deploy): void {
  // load factory (create if first exchange)
  // let factory = TokenMineFactory.load(FACTORY_ADDRESS)
  // if (factory == null) {
  //   factory = new TokenMineFactory(FACTORY_ADDRESS)
  // }
  // factory.pairCount = factory.pairCount + 1
  // factory.save()

  // log.info("\n\n============LOG=======================\n\n handleNewTokenMine",[])

  let tokenMine = new TokenMine(event.params.tokenMineAddress.toHexString()) as TokenMine
  tokenMine.owner = event.params.owner
  tokenMine.name = event.params.name
  tokenMine.stakingToken = event.params.stakingToken
  tokenMine.rewardsToken = event.params.rewardsToken
  tokenMine.startTime = event.params.startTime
  tokenMine.endTime = event.params.endTime
  tokenMine.rewardAmount = event.params.rewardAmount
  tokenMine.isStakingLPToken = event.params.isStakingLPToken
  tokenMine.createdAtTimestamp = event.block.timestamp
  tokenMine.createdAtBlockNumber = event.block.number

  tokenMine.stakingTokenSymbol = fetchTokenSymbol(event.params.stakingToken)
  tokenMine.stakingTokenName = fetchTokenName(event.params.stakingToken)
  let stakingTokenDecimals = fetchTokenDecimals(event.params.stakingToken)
  // bail if we couldn't figure out the decimals
  if (stakingTokenDecimals === null) {
    log.debug('mybug the decimal on stakingToken was null', [])
    return
  }
  tokenMine.stakingTokenDecimals = stakingTokenDecimals
  
  tokenMine.rewardsTokenSymbol = fetchTokenSymbol(event.params.rewardsToken)
  tokenMine.rewardsTokenName = fetchTokenName(event.params.rewardsToken)
  let rewardsTokenDecimals = fetchTokenDecimals(event.params.rewardsToken)
  // bail if we couldn't figure out the decimals
  if (rewardsTokenDecimals === null) {
    log.debug('mybug the decimal on rewardsToken was null', [])
    return
  }
  tokenMine.rewardsTokenDecimals = rewardsTokenDecimals
  
  if(event.params.isStakingLPToken) {
    let token0Address = fetchPairToken0(event.params.stakingToken)
    if(token0Address === null) {
      log.info("\n\n============LOG=======================\n\n mybug the address on token0 was null",[])
      // log.debug('========\n\n\n ======== mybug the address on token0 was null', [])
      return      
    }
    tokenMine.token0Symbol = fetchTokenSymbol(token0Address)
    tokenMine.token0Name = fetchTokenName(token0Address)
    let token0Decimals = fetchTokenDecimals(token0Address)
    // bail if we couldn't figure out the decimals
    if (token0Decimals === null) {
      log.debug('mybug the decimal on token0 was null', [])
      return
    }
    tokenMine.token0Decimals = token0Decimals
    
    let token1Address = fetchPairToken1(event.params.stakingToken)
    if(token1Address === null) {
      log.debug('mybug the address on token1 was null', [])
      return      
    }
    tokenMine.token1Symbol = fetchTokenSymbol(token1Address)
    tokenMine.token1Name = fetchTokenName(token1Address)
    let token1Decimals = fetchTokenDecimals(token1Address)
    // bail if we couldn't figure out the decimals
    if (token1Decimals === null) {
      log.debug('mybug the decimal on token1 was null', [])
      return
    }
    tokenMine.token1Decimals = token1Decimals
  }

  tokenMine.save()
}
