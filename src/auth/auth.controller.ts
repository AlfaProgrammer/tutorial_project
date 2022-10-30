import { Body, Controller, Get, HttpCode, HttpStatus, ParseIntPipe, Post } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller("auth")
export class AuthController{
    constructor(private authService: AuthService){}
    @Get()
    message(){
        return "Auth page GetRequest"
    }

    // @Post("signup")
    // signUp(@Req() req: Request ){ //Con req di type Request ho accesso a tutte le proprietà di una request express. Body, headers, query, param
    //     // console.log(req.query);        
    //     return this.authService.signUp();
    // }
    // noi preferiamo usare un approccio generalista. Con quello sopra se in un secondo modento decidi di andare a cambiare framework (fastify) 
    // quella funzione non andrà più perché specifica per express. 
    //Possiamo utilizzare i decoratori dedicati a tutto quello che ci serve... Come @Body @Param ecc
    // check here https://docs.nestjs.com/controllers#request-object

    //////////////////////////////////////////////UTILIZZIAMO I PIPE PER LE VALIDAZIONI ///////////////////////////////////////////////
    // @Post("signup") // posso separare tutte le prop del body e fare verifiche su ognuno di essi
    // signUp(
    //         @Body("email") email: string, 
    //         @Body("password", ParseIntPipe) password: string
    //         //mi arriva come stringa, ma voglio trsformarlo in numero
    //     ){
    //     console.log(email, password);        
    //     return this.authService.signUp();
    // }

    /////////////////////////////////////////////////USIAMO CLASS VALIDATOR //////////////////////////////////////////////////////////
    // si usa con i DTO
    @Post("signup")
    signUp(@Body() dto: AuthDto ){
        // console.log(dto);        
        return this.authService.signUp(dto);
    }
    
    @HttpCode(HttpStatus.OK) //non ci serve un 201 che viene dato di default
    @Post("signin")
    signIn(@Body() dto: AuthDto){
        return this.authService.signIn(dto);
    }
};