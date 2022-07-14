import { ethers } from 'ethers'

import { ValidContractNFTCallFunction } from '../clients/ethereum'

import { formatAddress } from './address'
import { ArtistProfile } from './artist'
import { ProcessedTrack } from './track'

export const ETHEREUM_NULL_ADDRESS = '0x0000000000000000000000000000000000000000'

export type EthereumContract = {
  address: string,
  startingBlock?: string,
}

export enum FactoryContractTypeName {
  soundArtistProfileCreator = 'soundArtistProfileCreator',
  ninaMintCreator = 'ninaMintCreator'
}

export type FactoryContract = EthereumContract & {
  platformId: string,
  contractType: FactoryContractTypeName,
  gap?: string
}

export type FactoryContractType = {
  newContractCreatedEvent: string,
  creationEventToERC721Contract: (event: ethers.Event) => ERC721Contract
}

type FactoryContractTypes = {
  [type in FactoryContractTypeName]: FactoryContractType
}

export const FactoryContractTypes: FactoryContractTypes = {
  soundArtistProfileCreator: {
    newContractCreatedEvent: 'CreatedArtist',
    creationEventToERC721Contract: (event: any) => ({
      address: formatAddress(event.args!.artistAddress),
      platformId: 'sound',
      startingBlock: event.blockNumber,
      contractType: ERC721ContractTypeName.default,
    })
  },
  ninaMintCreator: {
    newContractCreatedEvent: 'not implemeted',
    creationEventToERC721Contract: (event: any) => {
      throw 'creationEventToERC721Contract not implemented'
    }
  }
}

export enum ERC721ContractTypeName {
  default = 'default',
  zora = 'zora',
  nina = 'nina'
}

export type TypeMetadata = {
  overrides: {
    track?: Partial<ProcessedTrack>,
    artist?: Partial<ArtistProfile>
  }
}

export type ERC721Contract = EthereumContract & {
  platformId: string,
  contractType: ERC721ContractTypeName,
  name?: string,
  symbol?: string,
  typeMetadata?: TypeMetadata
}

export type ERC721ContractType = {
  contractCalls: ValidContractNFTCallFunction[],
  contractMetadataField: ValidContractNFTCallFunction,
  buildNFTId: (contractAddress: string, tokenId: bigint) => string,
}

type ERC721ContractTypes = {
  [type in ERC721ContractTypeName]: ERC721ContractType
}

export const NFTContractTypes: ERC721ContractTypes = {
  default: {
    contractCalls: [ValidContractNFTCallFunction.tokenURI],
    contractMetadataField: ValidContractNFTCallFunction.tokenURI,
    buildNFTId: buildERC721Id,
  },
  zora: {
    contractCalls: [ValidContractNFTCallFunction.tokenURI, ValidContractNFTCallFunction.tokenMetadataURI],
    contractMetadataField: ValidContractNFTCallFunction.tokenMetadataURI,
    buildNFTId: buildERC721Id,
  },
  nina: {
    contractCalls: [],
    buildNFTId: () => {throw 'not implementd buildNFTID'},
    contractMetadataField: ValidContractNFTCallFunction.tokenURI
  }
}

export function buildERC721Id(contractAddress: string, tokenId: bigint): string {
  return `${formatAddress(contractAddress)}/${tokenId.toString()}`;
}
