import * as fs from 'fs';
import {join} from "path";

export class MockPostTripRequest {
    cargoImg?: Express.Multer.File = {
        buffer: fs.readFileSync('./user-default-placeholder.png'),
        destination: "./",
        encoding: "7bit",
        fieldname: "cargoImg",
        filename: "user-default-placeholder.png",
        mimetype: "image/png",
        originalname: "cargoImg",
        path: join(process.cwd(), 'src', 'routes', 'request', 'Mock', 'user-default-placeholder.png'),
        size: fs.statSync('./user-default-placeholder.png').size,
        stream: undefined
    };


    //Todo: what have I done
}