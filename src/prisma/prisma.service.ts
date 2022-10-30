import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client'; //contiene i miei model definiti in schemas.prisma
// e tutte le funzionalità di prisma, come le query e altre cose

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(config: ConfigService ){
        super({//configurazione breve
            datasources: {
                db: {
                    url: config.get("DATABASE_URL")// file env
                }
            }
        })
    }
    
}
