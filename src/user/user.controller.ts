import {Get, Controller, UseGuards, Req} from "@nestjs/common"
import { User } from "@prisma/client";
import { GetUser } from "src/auth/decorator";
import { JwtGuard } from "src/auth/guard";

//Questo controller andrà a restituirci qualcosa per ogni rotta solo se supera determinate condizioni
// utilizziamo quindi i GUARDS https://docs.nestjs.com/guards
@UseGuards(JwtGuard)
@Controller("users")
export class UserController{
    //abbiamo creato una classe apposta che exprota semplicemente AuthGuard
    // @UseGuards(JwtGuard)
    @Get("me")
    //dobbiamo iniettare quello che la strategy appende come apendice alla request che arriva dal client
    //il payload della funzione validate della strategy
    getUser(@GetUser() user: User){ //questo type user arriva da prisma
        //abbiamo detto che prisma crea dei type ts basandosi sullo schema e li esporta
        //posso usare ora req.user par decidere cosa fargli vedere in questa rotta
        //req.user, viene definito di default da express, non sei tu a dire che req ha una prop user
        //semplicemente è una optional che esiste già appunto per questo scopo.
        return user;
    }
}