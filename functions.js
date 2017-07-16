/**
 * Created by Suhail on 7/14/17.
 */


var saveIt = (data) => {
    this.recentData = (data);
    console.log(this.recentData);
};

saveIt.recentData = {};

module.exports = {
    saveIt
};
