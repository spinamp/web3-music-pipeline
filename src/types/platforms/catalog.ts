import { MusicPlatform } from '../platform';
import { ProcessedTrack, Track } from '../track';
import { toUtf8Bytes, verifyMessage } from 'ethers/lib/utils';
import { formatAddress } from '../address';
import { ArtistProfile } from '../artist';
import { CatalogClient } from '../../clients/catalog';
import _ from 'lodash';

export const recoverCatalogAddress = (body: any, signature: string) => {
  const bodyString = JSON.stringify(body);
  const bodyHex = (toUtf8Bytes(bodyString));
  const recovered = verifyMessage(bodyHex, signature).toLowerCase();
  return recovered;
};

export const verifyCatalogTrack = (track: Track) => {
  const CATALOG_ETHEREUM_ADDRESS = '0xc236541380fc0C2C05c2F2c6c52a21ED57c37952'.toLowerCase();
  if (!track.metadata) {
    throw new Error('Track metadata missing')
  }
  if (!track.metadata.origin) {
    return false;
  }
  const signature = track.metadata.origin.signature;
  const body = track.metadata.body;
  return signature && body && recoverCatalogAddress(body, signature) === CATALOG_ETHEREUM_ADDRESS;
}

export const getZoraPlatform = (track: Track) => {
  if (track.platform !== MusicPlatform.zora) {
    throw new Error('Bad track platform being processed')
  }
  if (verifyCatalogTrack(track)) {
    return MusicPlatform.catalog;
  } else {
    return MusicPlatform.zoraRaw
  }
}

const getTokenIdFromTrack = (track: Track) => {
  return track.id.split('/')[1];
}

const mapTrackID = (trackId: string): string => {
  const [contractAddress, nftId] = trackId.split('/');
  return `ethereum/${formatAddress(contractAddress)}/${nftId}`;
};

const mapArtistID = (artistId: string): string => {
  return `ethereum/${formatAddress(artistId)}`;
};

const mapTrack = (trackItem: {
  track: Track;
  platformTrackResponse?: any;
}): ProcessedTrack => ({
  id: mapTrackID(trackItem.track.id),
  platformId: trackItem.platformTrackResponse.id,
  title: trackItem.platformTrackResponse.title,
  platform: MusicPlatform.catalog,
  lossyAudioIPFSHash: trackItem.platformTrackResponse.ipfs_hash_lossy_audio,
  lossyAudioURL: `https://catalogworks.b-cdn.net/ipfs/${trackItem.platformTrackResponse.ipfs_hash_lossy_audio}`,
  createdAtBlockNumber: trackItem.track.createdAtBlockNumber,
  lossyArtworkIPFSHash: `https://catalogworks.b-cdn.net/ipfs/${trackItem.platformTrackResponse.ipfs_hash_lossy_artwork}`,
  lossyArtworkURL: `https://catalogworks.b-cdn.net/ipfs/${trackItem.platformTrackResponse.ipfs_hash_lossy_artwork}`,
  websiteUrl:
    trackItem.platformTrackResponse.artist.handle && trackItem.platformTrackResponse.short_url
      ? `https://beta.catalog.works/${trackItem.platformTrackResponse.artist.handle}/${trackItem.platformTrackResponse.short_url}`
      : 'https://beta.catalog.works',
  artistId: mapArtistID(trackItem.platformTrackResponse.artist.id),
  artist: { id: mapArtistID(trackItem.platformTrackResponse.artist.id), name: trackItem.platformTrackResponse.artist.name }
});

const mapArtistProfile = (platformResponse: any, createdAtBlockNumber: string): ArtistProfile => {
  const artist = platformResponse.artist;
  return {
    name: artist.name,
    artistId: mapArtistID(artist.id),
    platformId: artist.id,
    platform: MusicPlatform.catalog,
    avatarUrl: artist.picture_uri,
    websiteUrl: artist.handle
      ? `https://beta.catalog.works/${artist.handle}`
      : 'https://beta.catalog.works',
    createdAtBlockNumber,
  }
};

const addPlatformTrackData = async (tracks: Track[], client: CatalogClient) => {
  const trackTokenIds = tracks.map(t => getTokenIdFromTrack(t));
  const platformTracks = await client.fetchCatalogTracksByNFT(trackTokenIds);
  const platformTrackDataByTokenId = _.keyBy(platformTracks, 'nft_id');
  const platformTrackData: { track: Track, platformTrackResponse: any }[]
    = tracks.map(track => ({
      track,
      platformTrackResponse: platformTrackDataByTokenId[getTokenIdFromTrack(track)]
    }));
  return platformTrackData;
}

export default {
  addPlatformTrackData,
  mapTrack,
  mapArtistProfile,
}