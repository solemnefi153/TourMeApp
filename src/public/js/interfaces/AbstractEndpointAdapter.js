
export default class AbstractEndpointAdapter
{
    constructor() {
        if(this.constructor == AbstractEndpointAdapter){
            throw new Error(" Object of Abstract Class cannot be created");
        }
    }
    async  accept(ConcreteApiVisitor,  parameters){
        throw new Error("Abstract Method has no implementation");
    }
}