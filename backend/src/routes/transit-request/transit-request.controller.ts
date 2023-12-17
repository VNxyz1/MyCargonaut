import {Controller, Post, Session, UseGuards} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {TransitRequestService} from "../transit-request.service/transit-request.service";
import {IsLoggedInGuard} from "../../guards/auth/is-logged-in.guard";
import {ISession} from "../../utils/ISession";

@ApiTags('transit-request')
@Controller('transit-request')
export class TransitRequestController {

    constructor(private readonly transitRequestService: TransitRequestService) {
    }

    @Post()
    @UseGuards(IsLoggedInGuard)
    async postTransitRequest(
        @Session() session: ISession
    ) {

        //Todo: überprüfung der coin balance erst wenn die fahrt "gekauft" wird
    }

}
