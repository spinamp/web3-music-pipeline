
import { Knex } from 'knex';

import { MetaFactory, FactoryContractTypeName } from '../../types/ethereum';
import { MusicPlatform, MusicPlatformType } from '../../types/platform';
import { addMetaFactory, addPlatform, removeMetaFactory, removePlatform } from '../migration-helpers';

const NINA_PLATFORM: MusicPlatform = {
  id: 'nina',
  type: MusicPlatformType.nina,
  name: 'Nina',
}

const NINA: MetaFactory = {
  address: 'ninaN2tm9vUkxoanvGcNApEeWiidLMM2TdBX8HoJuL4',
  platformId: NINA_PLATFORM.id,
  contractType: FactoryContractTypeName.ninaMintCreator
};

export const up = async (knex: Knex) => {
  await addPlatform(knex, NINA_PLATFORM);
  await addMetaFactory(knex, NINA)
}

export const down = async (knex: Knex) => {
  await removeMetaFactory(knex, NINA)
  await removePlatform(knex, NINA_PLATFORM)
}