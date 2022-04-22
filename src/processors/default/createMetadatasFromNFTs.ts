import _ from 'lodash';

import { EthClient, ValidContractCallFunction } from '../../clients/ethereum';
import { DBClient } from '../../db/db';
import { unprocessedNFTs } from '../../triggers/missing';
import { formatAddress } from '../../types/address';
import { Metadata } from '../../types/metadata';
import { filterNewMetadatas, getNFTContractCalls, NFT } from '../../types/nft';
import { Clients, Processor } from '../../types/processor';

const name = 'createMetadatasFromNFTs';

export const createMetadatasFromNFTs = async (nfts: NFT[], dbClient: DBClient, ethClient: EthClient) => {
  const nftsWithNewMetadata = await filterNewMetadatas(nfts, dbClient);
  const contractCalls = nftsWithNewMetadata.map(nft => getNFTContractCalls(nft));
  const flatContractCalls: {
    contractAddress: string;
    callFunction: ValidContractCallFunction;
    callInput: string;
  }[] = [];
  let flatContractCallsIndex = 0;
  const nftIndexToCalls = contractCalls.map((nftCalls) => {
    const callIndexes: number[] = [];
    nftCalls.forEach(call => {
      flatContractCalls.push(call);
      callIndexes.push(flatContractCallsIndex)
      flatContractCallsIndex++;
    });
    return callIndexes;
  });
  const callResults = await ethClient.call(flatContractCalls);
  const newMetadatas = nftsWithNewMetadata.map((nft, index) => {
    console.info(`Processing nft with metadata id ${nft.metadataId}`);
    const metadata: Metadata = {
      id: formatAddress(nft.metadataId),
      platformId: nft.platformId,
      createdAtTime: nft.createdAtTime,
      createdAtEthereumBlockNumber: nft.createdAtEthereumBlockNumber,
    };
    const callIndexes = nftIndexToCalls[index];
    callIndexes.forEach(callIndex => {
      const key = flatContractCalls[callIndex].callFunction;
      const value = callResults[callIndex];
      metadata[key] = value as string;
    });
    return metadata;
  });
  return newMetadatas;
};

const processorFunction = async (nfts: NFT[], clients: Clients) => {
  const newMetadatas = await createMetadatasFromNFTs(nfts, clients.db, clients.eth);
  await clients.db.insert('metadatas', newMetadatas);
};

export const createMetadatasFromNFTsProcessor: Processor = {
  name,
  trigger: unprocessedNFTs,
  processorFunction,
  initialCursor: undefined,
};