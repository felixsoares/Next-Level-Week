import knex from '../database/connection'
import { Request, Response } from 'express';

class PointsController {

    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query
        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('points_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points*');

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://localhost:3333/uploads/${point.image}`
            }
        });

        return response.json(serializedPoints);
    }

    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            city,
            uf,
            latitude,
            longitude,
            items
        } = request.body

        const trx = await knex.transaction();

        const point = {
            image: request.file.fieldname,
            name,
            email,
            whatsapp,
            city,
            uf,
            latitude,
            longitude,
        }
        const insertedIds = await trx('points').insert(point);

        const point_id = insertedIds[0];
        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    item_id: item_id,
                    point_id: point_id
                }
            })

        await trx('points_items').insert(pointItems);
        await trx.commit();

        return response.json({ id: point_id, ...point });
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if (!point) {
            return response.status(400).json({ message: 'não encontrado' });
        }

        const serializedPoint = {
            ...point,
            image_url: `http://localhost:3333/uploads/${point.image}`
        };

        const items = await knex('items')
            .join('points_items', 'items.id', '=', 'points_items.item_id')
            .where('points_items.point_id', id)
            .select('items.title');

        return response.json({ serializedPoint, items });
    }
}

export default PointsController;