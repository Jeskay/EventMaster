import { Election } from "../Utils";

export class VoteManager {
    private elections: Map<string, Election>;
    /**
    *Creates  new election instance
    */
    public start(occasion: string, goal: number){
        this.elections[occasion] = new Election(goal);
    }
    /**
     * Removes new election instance
    */
    public finish(occasion: string){
        this.elections.delete(occasion);
    }
    /** 
     * Removes candidate from elections list
    */
    public async removeCandidate(user: string, occasion: string) {
        if(!this.elections.has(occasion)) throw Error("There is no current election in the channel.");
        await this.elections[occasion].remove(user);
    }
    /**
     * Performs vote operation
     * @returns true if the candidate won the election otherwise returns false
     */
    public async vote(occasion: string, voter: string, candidate: string) {
        if(this.elections[occasion] == undefined) throw Error("There is no current election in the channel.");
        return await this.elections[occasion].add(voter, candidate);
    }
    
    constructor(){
        this.elections = new Map<string,Election>();
    }
}