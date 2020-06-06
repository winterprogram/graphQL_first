let appconfig = {}

appconfig.port = 3000;
// appconfig.Crosorigin = "http://localhost:4200/";
appconfig.env = "dev";
appconfig.db = {
    uri :"mongodb://127.0.0.1:27017/graph"
};
// appconfig.db={
//     uri:`mongodb+srv://servertest:examidea123@cluster0-lbhqk.mongodb.net/test?retryWrites=true&w=majority`
// }
appconfig.version = "0.0.1"

module.exports = {
    port: appconfig.port,
    // domains: appconfig.Crosorigin,
    env: appconfig.env,
    db: appconfig.db,
    version: appconfig.version
}