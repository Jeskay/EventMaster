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