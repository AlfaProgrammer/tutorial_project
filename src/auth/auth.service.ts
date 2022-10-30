import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AuthService{
    constructor(
        private prisma: PrismaService, 
        private jwt: JwtService,
        private config: ConfigService
    ){}
    
    
    async signUp(dto: AuthDto){
        try {
            //generate password
            const hash = await argon.hash(dto.password);
            //save new user in db
            const user = await this.prisma.user.create({
                data: { //i dati per creare lo user
                    email: dto.email,
                    hash,
                },
                //questa funzione create ritorna di default il record creato. 
                //io però voglio selezionare le colonne del record da ritornare, non voglio la password in ritorno
                //posso usare select: {fieldDaRiportare: true}
                //oppure fare un delete dopo
            })
            //return saved user
            // delete user.hash
            // return user;

            return this.signToken(user.id, user.email)

        } catch (error) {
            //tutta roba di prisma che trovi in doc
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === "P2002"){
                    //codici riservati da prisma
                    throw new ForbiddenException("User already exists") // errore di NEST
                }
            }
            throw error
        }
    }

    async signIn(dto: AuthDto){// qui vedi tu se avere una dto diversa
        //find the user email
        const user = await this.prisma.user.findFirst({ //puoi usare anche findUnique se hai impostato una field su Unique come la mail
            where: {
                email: dto.email
            },
        })
        //if user does not exist throw exception
        if(!user){
            throw new ForbiddenException("Credentials Incorrect")
        }
        //compare password, usiamo le funzioni di argon stesso
        const pwMatches = await argon.verify(user.hash, dto.password)
        //throw error if incorrect
        if(!pwMatches){
            throw new ForbiddenException("Credentials Incorrect")
        }
        
        //send back the user
        // delete user.hash non devo più nemmeno eliminare questo perché il token sara
        //composto solo da id ed email
        // return user; devo ritornare il token invece di questo
        return this.signToken(user.id, user.email)
    }

    //dobbiamo trasformare i dati dello user che arrivano dal client in token
    //cosi possiamo comunicarli continuamente tra server e client
     async signToken(userId: number, email:string): Promise<{access_token: string}>{ //return oggetto con quel prop specifico
        //string perché il mio token sarà una stringa
        //siccome ritorno la promise stessa, che ancora dovrebbe in teoria essere risolta, 
        // non devo dichiarare questa funzione come async

        //andro a prendere userId e email per verificare che tipo di autorizzazioni ha il mio user
        //e quali azioni può compiere e quindi poi compierò quella azione una volta verificato
        const payload = {
            sub: userId,
            email
        }
        //il tocken deve essere una stringa. Il return di signToken è una promise per forza perché la funzionee è async
        //se non risolvessi questa promessa con await avrei un altra promessa qui, quindi il return dell'intera funzione sarebbe
        // {access_token: Promise<string>} io voglio pero che sia Promise<{access_token: string}>
        const token = await this.jwt.signAsync(payload, {
            //qui inseriamo la signature per riconoscere che siamo noi che abbiamo autenticato lo user
            expiresIn: "30d", //15min valido
            secret: this.config.get("JWT_SECRET") //in env ovviamente
        })

        return {
            access_token: token
        }
    }
    
};