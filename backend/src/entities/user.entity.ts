import { ManyToMany, ManyToOne, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import Event from "./event.entity";
import Expense from "./expense.entity";

@Entity()
export default class User {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	name: string = '';

	// @ManyToMany(() => Event, (event) => event.users, { onDelete: "CASCADE" })
    // events!: Event[];

	@ManyToOne(() => Event, (events) => events.users, { onDelete: 'CASCADE' })
    events!: Event;

	@ManyToMany(() => Expense, (expense) => expense.participants, )
    expenses!: Expense[];
}