import { Knex } from 'knex';

import { ContractTypeName } from '../../types/ethereum';
import { MusicPlatform } from '../../types/platform';

const INITIAL_CONTRACTS = [
  {
    id: '0xabefbc9fd2f806065b4f3c237d4b59d9a97bcac7',
    platformId: MusicPlatform.zora,
    startingBlock: '11565020',
    contractType: ContractTypeName.zora,
  },
  {
    id: '0xf5819e27b9bad9f97c177bf007c1f96f26d91ca6',
    platformId: MusicPlatform.noizd,
    startingBlock: '13470560',
    contractType: ContractTypeName.default,
  },
  {
    id: '0x0bc2a24ce568dad89691116d5b34deb6c203f342',
    platformId: MusicPlatform.catalog,
    startingBlock: '14566825',
    contractType: ContractTypeName.default,
  }
]

export const up = async (knex: Knex) => {
  console.log('Running create contracts bootstrap');
  await knex.schema.createTable('erc721Contracts', (table: Knex.CreateTableBuilder) => {
    table.string('id').primary();
    table.string('platformId');
    table.foreign('platformId').references('id').inTable('platforms');
    table.string('startingBlock');
    table.string('contractType');
  });
  await knex('erc721Contracts').insert(INITIAL_CONTRACTS);
};

exports.down = async (knex: Knex) => {
  await knex.schema.dropTable('erc721Contracts');
}