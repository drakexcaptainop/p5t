class BaseSingleton{
    static _instance = null 
    static initialize(...args){
        this._instance = new this(...args)
        return this._instance
    }
    static get instance(){
        // .ini
        return this._instance
    }
}
