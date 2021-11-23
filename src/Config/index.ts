export class Config{
    public token: string;
    /**@deprecated use slash commands instead*/
    public prefix: string;
    public state: "dev" | "prod";
    constructor(){
        const token = process.env.TOKEN;
        const prefix = process.env.PREFIX;
        const state = process.env.PRODUCTION;
        if(state == undefined) throw new Error("No application state was set.");
        if(token == undefined) throw new Error("Incorrect token passed.");
        if(prefix == undefined) this.prefix = "!";
        else this.prefix = prefix;
        if(state == "dev") this.state = "dev";
        if(state == "prod") this.state = "prod";
        this.token = token;
    }
}