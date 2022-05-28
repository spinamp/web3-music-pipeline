import { Knex } from 'knex';

import { ERC721ContractTypeName } from '../../types/ethereum';
import { Table } from '../db';

const ASYNC_PLATFORM = [
  { id: 'async', name: 'async', type: 'async' },
]

const ASYNC_CONTRACTS = [
  {
    id: '0xb6dae651468e9593e4581705a09c10a76ac1e0c8',
    startingBlock: '10501503',
    platformId: 'async',
    contractType: ERC721ContractTypeName.default,
  },
]

export const up = async (knex: Knex) => {
  await knex.raw(`ALTER TABLE platforms drop constraint "platforms_type_check"`);
  await knex.raw(`ALTER TABLE platforms add constraint "platforms_type_check" CHECK (type = ANY (ARRAY['noizd'::text, 'catalog'::text, 'sound'::text, 'zora'::text, 'single-track-multiprint-contract'::text, 'async'::text]))`);
  await knex(Table.platforms).insert(ASYNC_PLATFORM);
  await knex(Table.erc721Contracts).insert(ASYNC_CONTRACTS);
};

exports.down = async (knex: Knex) => {
  await knex.raw(`delete from "${Table.erc721nfts}" where "platformId" = 'async'`)
  const result = await knex.raw(`select cursor from processors where id='createERC721NFTsFromTransfers';`);
  const parsedCursor = JSON.parse(result.rows[0].cursor);
  delete parsedCursor['0xb6dae651468e9593e4581705a09c10a76ac1e0c8'];
  const updatedCursor = JSON.stringify(parsedCursor);
  await knex.raw(`update processors set cursor='${updatedCursor}' where id='createERC721NFTsFromTransfers';`);
  await knex.raw(`delete from "${Table.erc721Contracts}" where id in ('0xb6dae651468e9593e4581705a09c10a76ac1e0c8')`)
  await knex.raw(`delete from "${Table.platforms}" where id = 'async'`)
  await knex.raw(`ALTER TABLE "${Table.platforms}" drop constraint "platforms_type_check"`);
  await knex.raw(`ALTER TABLE "${Table.platforms}" add constraint "platforms_type_check" CHECK (type = ANY (ARRAY['noizd'::text, 'catalog'::text, 'sound'::text, 'zora'::text, 'single-track-multiprint-contract'::text]))`);
}
