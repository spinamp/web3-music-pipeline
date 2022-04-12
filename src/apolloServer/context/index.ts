import db from '../../db/local-db'

export default  async () => {
    const dbClient = await db.init();
    return {
        dbClient
    };   
};
