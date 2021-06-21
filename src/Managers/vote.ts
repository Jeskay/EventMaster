
export class Election{
    private goal: number;
    public votes: {[key: string]: number};
    public voted: string[];
    public check(){
        var max = 0;
        var winner;
        for(var index in this.votes){
            if(this.votes[index] > max){
                winner = index;
                max = this.votes[index];
            }
        }
        if(max >= this.goal) return winner;
        return null;
    }
    constructor(goal: number){
        this.goal = goal;
    }
}

export class VoteManger{
    private elections: Map<string, Election>;
    
    public start(occasion: string, goal: number){
        this.elections[occasion] = new Election(goal);
    }

    public finish(occasion: string){
        this.elections[occasion] = null;
    }

    public vote(occasion: string, voter: string, candidate: string){
        if(this.elections[occasion] == null) return false;
        if(this.elections[occasion].voted.includes(voter)) return false;
        this.elections[occasion].voted.join(voter);
        this.elections[occasion].votes[candidate]++;
        const check = this.elections[occasion].check();
        if(check == null) return true;
        return check;
    }
}