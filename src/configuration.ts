
export default class Configuration {
    public static baseLocalFolder = './assets/';
    public static mongoUri = 'mongodb://mongo:27017/wordstats';
    public static mongooseDebugMode = false;
    public static logLevel = 'debug';

    /*
    Set useTransaction to true to make sure documents are either fully processed or not, however in case of extremely large txt files
    (say 100Mb), this will force us to make a choice between long running transactions and memory use. In this implemenntation I have
    prefered memory use.
    */
    public static useTransaction = false;
}
