export class HelperManager{
    public extractID(input: string){
        console.log(input);
        const extracted = input.substr(2, input.length - 3);
        console.log(extracted);
        return extracted;
    }
}