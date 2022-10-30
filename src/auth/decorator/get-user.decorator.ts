
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
    //data prenderà qulsiasi cosa tu passi al decoratore come parametro
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx //Express.request infatti puoi anche tipizzarla cosi
    .switchToHttp() //se fosse un websocket lo metterei qui
    .getRequest(); //tipo di request

    if(data){
        return request.user[data]
    }
    
    return request.user; // qualsiasi cosa ritorno qui, sarà la mia istanza quando 
    //faro la DI di questo decoratore...
  },
);
