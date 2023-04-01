import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from "../users/user.entity";

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: string;

  @Column()
  mileage: number;

  @Column()
  lng: string;

  @Column()
  lat: string;

  @Column({default: false})
  approved: boolean;

  @ManyToOne(() => User, (user) => user.reports )
  user: User

}
