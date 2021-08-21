export class Election {
    private goal: number;
    
    private votes: Map<string, string>;

    public score: Map<string,number>;
    
    public leader: string;

    private check(candidate: string): boolean{
        if(this.score[candidate] >= this.goal) {
            this.leader = candidate;
            return true;
        }
        return false;
    }

    public async add(voter: string, candidate: string) {
        if(this.votes.has(voter)) throw Error("Person has already voted");
        if(this.score[candidate] == undefined) this.score[candidate] = 1;
        else this.score[candidate]++;
        this.votes[voter] = candidate;
        if(this.check(candidate)) return true;
        return false; 
    }
    
    public async remove(voter: string) {
        if(!this.votes.has(voter)) throw Error("Person has not voted yet");
        const candidate = this.votes[voter] as string;
        this.score[candidate]--;
        this.votes.delete(voter);
    }
    
    constructor(goal: number){
        this.goal = goal;
        this.votes = new Map<string, string>();
        this.score = new Map<string, number>();
    }
}

export class VoteManager {
    private elections: Map<string, Election>;
    /**
    *Creates  new election instance
    */
    public start(occasion: string, goal: number){
        this.elections[occasion] = new Election(goal);
        console.log(`election in voice ${occasion} started`);
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