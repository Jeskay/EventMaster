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

    public add(voter: string, candidate: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if(this.votes.has(voter)) reject();
            if(this.score[candidate] == undefined) this.score[candidate] = 1;
            else this.score[candidate]++;
            this.votes[voter] = candidate;
            if(this.check(candidate)) resolve(true);
            resolve(false); 
        });
    }
    
    public remove(voter: string): Promise<void>{
        return new Promise((resolve, reject) => {
            if(!this.votes.has(voter)) reject();
            const candidate = this.votes[voter] as string;
            this.score[candidate]--;
            this.votes.delete(voter);
            resolve();
        });
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
        return new Promise<void>(async (resolve, reject) => {
            if(!this.elections.has(occasion)) reject();
            await this.elections[occasion].remove(user).catch((err) => reject(err));
            resolve();
        });
    }
    /**
     * Performs vote operation
     * @return winner id if election is over, otherwise returns null
     */
    public async vote(occasion: string, voter: string, candidate: string){
        return new Promise<string | null>(async (resolve, reject) => {
            if(this.elections[occasion] == undefined) reject();
            const elected = await this.elections[occasion].add(voter, candidate).catch(err => reject(err));
            if(elected){
                resolve(this.elections[occasion].leader);
            }
            resolve(null);
        });        
    }
    constructor(){
        this.elections = new Map<string,Election>();
    }
}