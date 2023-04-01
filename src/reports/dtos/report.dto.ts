import {Expose, Transform} from "class-transformer";

export class ReportDto {

    @Expose()
    id: number;

    @Expose()
    price: string;

    @Expose()
    make: string;

    @Expose()
    model: string;

    @Expose()
    year: string;

    @Expose()
    mileage: number;

    @Expose()
    lng: string;

    @Expose()
    lat: string;

    @Expose()
    approved: boolean;

    @Transform(({obj}) => {
        if (obj.user) {
            return obj.user.id;
        }
    })
    @Expose()
    userId: number;
}