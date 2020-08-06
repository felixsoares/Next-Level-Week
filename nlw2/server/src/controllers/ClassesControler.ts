import { Request, Response } from 'express';
import db from '../database/connection';
import convertHoursToMinutes from '../utils/convert_hour_to_minuts';

interface ScheduleItem {
    week_day: number,
    from: string,
    to: string
}

export default class ClassesController {

    async create(request: Request, response: Response) {
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = request.body;

        const transaction = await db.transaction();

        try {
            const insertedUserIds = await transaction('users').insert({
                name,
                avatar,
                whatsapp,
                bio
            });

            const insertedClassesIds = await transaction('classes').insert({
                subject,
                cost,
                user_id: insertedUserIds[0]
            });

            const classSchedule = schedule.map((schduleItem: ScheduleItem) => {
                return {
                    week_day: schduleItem.week_day,
                    from: convertHoursToMinutes(schduleItem.from),
                    to: convertHoursToMinutes(schduleItem.to),
                    class_id: insertedClassesIds[0]
                }
            });
            await transaction('class_schedule').insert(classSchedule);

            await transaction.commit();

            response.status(201).send({ success: true });
        } catch (err) {
            console.log(err);
            await transaction.rollback();
            response.status(400).send({ success: false, message: "Error" });
        }
    };

    async index(request: Request, response: Response) {
        const filters = request.query;

        const subject = filters.subject as string;
        const week_day = filters.week_day as string;
        const time = filters.time as string

        const timeInMinuts = convertHoursToMinutes(time);
        const classes = await db('classes')
            .whereExists(function () {
                this.select('class_schedule.*')
                    .from('class_schedule')
                    .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                    .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
                    .whereRaw('`class_schedule`.`from` <= ??', [timeInMinuts])
                    .whereRaw('`class_schedule`.`to` > ??', [timeInMinuts])

            })
            .where('classes.subject', '=', subject)
            .join('users', 'classes.user_id', '=', 'users.id')
            .select(['classes.*', 'users.*']);

        response.status(201).json(classes);

    }
}