export default async (parent: any, args: any, context: any, info: any) => {
    const valueIsWhere = args.valueIsWhere ? args.valueIsWhere : [];
    const valueInWhere = args.valueInWhere ? args.valueInWhere : [];
    const valueExistsWhere = args.valueExistsWhere ? args.valueExistsWhere : [];

    const artists = (await context.dbClient.getRecords('artists',
    {
      where: [
        ...valueIsWhere,
        ...valueInWhere,
        ...valueExistsWhere,
    ]
    })).slice(0, parseInt(process.env.SERVE_BATCH_SIZE!));

    // Replace the dictionary of profiles with a list of profiles
    artists.forEach( (artist: any) => {
        artist.profiles = Object.values(artist.profiles);
    });

    return artists
};