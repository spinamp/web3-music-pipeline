import { BigNumber, ethers } from 'ethers';
import _ from 'lodash';

import { Table } from '../../db/db';
import { newERC721Transfers } from '../../triggers/newNFTContractEvent';
import { formatAddress } from '../../types/address';
import { ETHEREUM_NULL_ADDRESS } from '../../types/ethereum';
import { NFT, ERC721Transfer, NftFactory, NFTStandard } from '../../types/nft';
import { NFTFactoryTypes } from '../../types/nftFactory';
import { Clients, Processor } from '../../types/processor';
import { Cursor } from '../../types/trigger';

const NAME = 'createERC721NFTsFromTransfers';

const CHAIN = 'ethereum';

const processorFunction = (contracts: NftFactory[]) =>
  async ({ newCursor, items }: { newCursor: Cursor, items: ethers.Event[] }, clients: Clients) => {
    const contractsByAddress = _.keyBy(contracts, 'address');
    const newNFTs: Partial<NFT>[] = [];
    const updates: Partial<NFT>[] = [];
    const transfers: Partial<ERC721Transfer>[] = [];
    const allNfts = await clients.db.getRecords<NFT>(Table.nfts);
    const allNftContractAddresses = new Set(allNfts.map(nft => nft.contractAddress));
    items.forEach((item): Partial<NFT> | undefined => {
      const address = item.address;
      const contract = contractsByAddress[address];
      const contractTypeName = contract.contractType;
      const contractType = NFTFactoryTypes[contractTypeName];

      if (!contractType?.buildNFTId){
        throw 'buildNFTId not specified'
      }

      const tokenId = BigInt((item.args!.tokenId as BigNumber).toString());
      const newMint = item.args!.from === ETHEREUM_NULL_ADDRESS;
      if (allNftContractAddresses.has(formatAddress(contract.address))){
        transfers.push({
          id: `${CHAIN}/${item.blockNumber}/${item.logIndex}`,
          contractAddress: formatAddress(contract.address),
          from: item.args!.from,
          to: item.args!.to,
          tokenId,
          createdAtEthereumBlockNumber: '' + item.blockNumber,
          nftId: contractType.buildNFTId(contract.address, tokenId), 
        });
      }
      if (!newMint) {
        updates.push({
          id: contractType.buildNFTId(contract.address, tokenId),
          owner: item.args!.to
        })
        return undefined;
      }
      newNFTs.push({
        id: contractType.buildNFTId(contract.address, tokenId),
        createdAtEthereumBlockNumber: '' + item.blockNumber,
        contractAddress: formatAddress(contract.address),
        tokenId,
        platformId: contract.platformId,
        owner: item.args!.to
      });
    });
    await clients.db.insert(Table.nfts, newNFTs.filter(n => !!n));
    await clients.db.update(Table.nfts, updates);
    await clients.db.insert(Table.erc721Transfers, transfers);
    await clients.db.updateProcessor(NAME, newCursor);
  };

export const createERC721NFTsFromTransfersProcessor: (contracts: NftFactory[]) => Processor = (contracts: NftFactory[]) => {
  return {
    name: NAME,
    trigger: newERC721Transfers(
      contracts
        .filter(c => c.standard === NFTStandard.ERC721) //only include ERC721 contracts
        .map(c => ({ address: c.address, startingBlock: c.startingBlock! })) // map contracts to EthereumContract
    ),
    processorFunction: processorFunction(contracts),
  }
};
