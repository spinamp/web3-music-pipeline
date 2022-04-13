export default async (parent: any, args: any, context: any, info: any) => {
    const valueIsWhere = args.valueIsWhere ? args.valueIsWhere : [];
    const valueInWhere = args.valueInWhere ? args.valueInWhere : [];
    const valueExistsWhere = args.valueExistsWhere ? args.valueExistsWhere : [];

    const tracks = (await context.dbClient.getRecords('tracks',
    {
      where: [
        ...valueIsWhere,
        ...valueInWhere,
        ...valueExistsWhere,
    ]
    })).slice(0, parseInt(process.env.SERVE_BATCH_SIZE!));
    
    return tracks;
};
