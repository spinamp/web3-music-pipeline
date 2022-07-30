import { Knex } from 'knex';

import { NFTContractTypeName, NftFactory, NFTStandard } from '../../types/ethereum';
import { MusicPlatformType } from '../../types/platform';
import { addNftFactory, removeNftFactory } from '../migration-helpers';

const INITIAL_CONTRACTS: NftFactory[] = [
  {
    address: '0xabefbc9fd2f806065b4f3c237d4b59d9a97bcac7',
    startingBlock: '11565020',
    contractType: NFTContractTypeName.zora,
    standard: NFTStandard.ERC721,
    platformId: MusicPlatformType.zora
  },
  {
    address: '0xf5819e27b9bad9f97c177bf007c1f96f26d91ca6',
    platformId: MusicPlatformType.noizd,
    startingBlock: '13470560',
    contractType: NFTContractTypeName.default,
    standard: NFTStandard.ERC721,
  },
  {
    address: '0x0bc2a24ce568dad89691116d5b34deb6c203f342',
    platformId: MusicPlatformType.catalog,
    startingBlock: '14566825',
    contractType: NFTContractTypeName.default,
    standard: NFTStandard.ERC721,
  }
]

export const up = async (knex: Knex) => {
  INITIAL_CONTRACTS.forEach(contract => {
    addNftFactory(knex, contract )
  })
};

exports.down = async (knex: Knex) => {
  INITIAL_CONTRACTS.forEach(contract => {
    removeNftFactory(knex, contract )
  })
}