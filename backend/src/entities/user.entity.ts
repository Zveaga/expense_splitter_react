import { ManyToMany, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import Event from "./event.entity";
import Expense from "./expense.entity";

@Entity()
export default class User {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	name: string = '';

	@ManyToMany(() => Event, (event) => event.users)
    events!: Event[];

	@ManyToMany(() => Expense, (expense) => expense.participants)
    expenses!: Expense[];
}