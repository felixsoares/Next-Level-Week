import express, { request } from 'express';
import multer from 'multer';
import { celebrate, Joi } from 'celebrate';

import PointsController from './controllers/points_controller';
import ItemsController from './controllers/items_controller';
import multerConfig from './config/multer';

const points_controller = new PointsController();
const items_controller = new ItemsController();

const routes = express.Router();
const upload = multer(multerConfig);

routes.get('/items', items_controller.index);
routes.get('/points/:id', points_controller.show);
routes.get('/points', points_controller.index);

routes.post(
    '/points',
    upload.single('image'),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.number().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required(),
        })
    }, {
        abortEarly: false
    }),
    points_controller.create
);

export default routes;