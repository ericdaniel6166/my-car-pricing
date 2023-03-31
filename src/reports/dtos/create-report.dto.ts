import {IsLatitude, IsLongitude, IsNumber, IsString, Min} from "class-validator";

export class CreateReportDto{
    @IsNumber()
    @Min(0)
    price: number;

    @IsString()
    make: string;

    @IsString()
    model: string;

    @IsNumber()
    @Min(1930)
    year: number;

    @IsNumber()
    @Min(0)
    mileage: number;

    @IsLongitude()
    lng: number;

    @IsLatitude()
    lat: number;


}