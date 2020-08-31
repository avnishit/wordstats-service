
export default class Configuration {
    public static httpPort = 5000;
    public static baseLocalFolder = './assets/';
    public static mongoUri = 'mongodb://mongo:27017/wordstats';
    public static mongooseDebugMode = false;
    public static maxParallelDbUpdates = 50;
    public static logLevel = 'debug';
    public static queueDelay = 5000;

    /*
    Set useTransaction to true to make sure documents are either fully processed or not, however in case of extremely large txt files
    (say 100Mb), this forces us to make a choice between long running muti doc transactions (which can be disastirius) and memory use.
    In this implemenntation I have prefered extra memory use for supporting transactions.
    */

    public static useTransaction = false;
}
