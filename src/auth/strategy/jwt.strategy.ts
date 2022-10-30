import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

//Questo è cmq un service del modulo auth, solo che lo teniamo in una cartella separate visto
//che si occupa di qualcosa di così importante come l'authorizzazione del token
// Dovremo quindi importare questo service dentro i providers del modulo auth
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt"){
    constructor(
        config: ConfigService,
        private prisma: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get("JWT_SECRET")
        });
    
    }
    //OKAY, il token ora mi arriva dal client. Però devo trasformararlo in dato leggibile per il server, 
    //per poter fare le verifiche

    async validate(payload: {sub: number, email:string}){   
        const user = await this.prisma.user.findFirst({
            where: {
                id: payload.sub
            }
        })    

        delete user.hash;
        
        return user; //se qui è null il server dara errore ,,, unauthorized ...quindi perfetto 
    }
}