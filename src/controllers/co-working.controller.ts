import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {
    Count,
    CountSchema,
    FilterExcludingWhere,
    repository,
    Where,
} from '@loopback/repository';
import {
    del,
    get,
    getModelSchemaRef,
    HttpErrors,
    param,
    patch,
    post,
    Request,
    requestBody,
    Response,
    RestBindings,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {basicAuthorization} from '../access-control/authenticator/basic-authentication';
import {CoWorking, Room, User} from '../models';
import {
    CoWorkingRepository,
    RoomRepository,
    UserRepository,
} from '../repositories';
import {deleteFiles, parseRequest, saveFiles} from '../services/file-upload';

const loopback = require('loopback');

export class CoWorkingController {
    constructor(
        @repository(CoWorkingRepository)
        public coWorkingRepository: CoWorkingRepository,
        @repository(UserRepository) public userRepository: UserRepository,
        @repository(RoomRepository) public roomRepository: RoomRepository,
    ) {}

    /**
     * Create CoWorking on user
     * Body type appl/json
     * id in URL is userID
     */

    @authenticate('jwt')
    @authorize({
        allowedRoles: ['host'],
        voters: [basicAuthorization],
    })
    @post('/users/{id}/co-working', {
        responses: {
            '200': {
                description: 'User model instance',
                content: {
                    'application/json': {schema: getModelSchemaRef(CoWorking)},
                },
            },
        },
    })
    async create(
        @param.path.string('id') id: typeof User.prototype.id,
        @requestBody({
            description: 'Create coworking',
            required: true,
            content: {
                'multipart/form-data': {
                    'x-parser': 'stream',
                    schema: {
                        type: 'object',
                        properties: {
                            coworking: {
                                type: 'string',
                            },
                        },
                    },
                },
            },
        })
        request: Request,
        @inject(RestBindings.Http.RESPONSE)
        response: Response,
    ) {
        const coCreated = await this.coWorkingRepository.findOne({
            where: {
                userId: id,
            },
        });
        // if (coCreated) {
        //     throw new HttpErrors.BadRequest(
        //         'User already register to a CoWorking',
        //     );
        // }
        const req: any = await parseRequest(request, response);
        const uploadFile: any = await saveFiles(req.files);
        if (uploadFile.error) {
            throw new HttpErrors.BadRequest(uploadFile.message);
        }
        req.fields.photo = uploadFile;
        const coWorking = new CoWorking(req.fields);
        // return new CoWorking();
        return this.userRepository.coWorking(id).create(coWorking);
    }

    /**
     * Count num of CoWorking
     */
    @authenticate('jwt')
    @authorize({
        allowedRoles: [],
        voters: [basicAuthorization],
    })
    @get('/co-workings/count', {
        responses: {
            '200': {
                description: 'CoWorking model count',
                content: {'application/json': {schema: CountSchema}},
            },
        },
    })
    async count(
        @param.where(CoWorking) where?: Where<CoWorking>,
    ): Promise<Count> {
        return this.coWorkingRepository.count(where);
    }

    @authenticate('jwt')
    @authorize({
        allowedRoles: [],
        voters: [basicAuthorization],
    })
    @get('/co-workings', {
        responses: {
            '200': {
                description: 'Array of CoWorking model instances',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: getModelSchemaRef(CoWorking, {
                                includeRelations: true,
                            }),
                        },
                    },
                },
            },
        },
    })
    async find(@param.query.string('name') name: string): Promise<CoWorking[]> {
        let whereCond: any = {};
        if (name) {
            whereCond.name = {like: name};
        }
        return this.coWorkingRepository.find({
            where: whereCond,
            include: [
                {
                    relation: 'user',
                    scope: {
                        fields: {
                            id: true,
                            email: true,
                            fullname: true,
                            phoneNumber: true,
                            address: true,
                        },
                    },
                },
            ],
        });
    }

    /**
     * Find CoWorking by ID
     */
    @authenticate('jwt')
    @authorize({
        allowedRoles: [],
        voters: [basicAuthorization],
    })
    @get('/co-workings/{id}', {
        responses: {
            '200': {
                description: 'CoWorking model instance',
                content: {
                    'application/json': {
                        schema: getModelSchemaRef(CoWorking, {
                            includeRelations: true,
                        }),
                    },
                },
            },
        },
    })
    async findById(
        @param.path.string('id') id: string,
        @param.filter(CoWorking, {exclude: 'where'})
        filter?: FilterExcludingWhere<CoWorking>,
    ): Promise<CoWorking> {
        return this.coWorkingRepository.findById(id, filter);
    }

    /**
     * Update CoWorking by ID
     */
    @authenticate('jwt')
    @authorize({
        allowedRoles: ['host'],
        voters: [basicAuthorization],
    })
    @patch('/co-workings/{id}', {
        responses: {
            '204': {
                description: 'CoWorking PATCH success',
            },
        },
    })
    async updateById(
        @param.path.string('id') id: string,
        @requestBody({
            content: {
                'multipart/form-data': {
                    'x-parser': 'stream',
                    schema: {
                        type: 'object',
                        properties: {
                            coworking: {
                                type: 'string',
                            },
                        },
                    },
                },
            },
        })
        request: Request,
        @inject(RestBindings.Http.RESPONSE) response: Response,
        @inject(SecurityBindings.USER) user: UserProfile,
    ) {
        const coWorking = await this.coWorkingRepository.findById(id);
        if (user[securityId].localeCompare(coWorking.userId)) {
            throw new HttpErrors.Unauthorized();
        }
        if (!coWorking) {
            throw new HttpErrors.NotFound('Not found CoWorking');
        }
        const req: any = await parseRequest(request, response);
        coWorking.photo = await coWorking.photo.filter(img => {
            if (!req.fields.oldPhoto.includes(img)) {
                deleteFiles([img]);
                return false;
            }
            return true;
        });
        const newPhoto: any = await saveFiles(req.files);
        if (newPhoto.error) {
            throw new HttpErrors.BadRequest(newPhoto.message);
        }
        // coWorking.photo = [...coWorking.photo, ...newPhoto];
        const updateCW = new CoWorking(
            Object.assign({}, coWorking, req.fields, {
                photo: [...coWorking.photo, ...newPhoto],
                modifiedAt: Date(),
            }),
        );

        await this.coWorkingRepository.update(updateCW);
    }

    /**
     * Delete CoWorking by ID
     */
    @authenticate('jwt')
    @authorize({
        allowedRoles: ['host'],
        voters: [basicAuthorization],
    })
    @del('/co-workings/{id}', {
        responses: {
            '204': {
                description: 'CoWorking DELETE success',
            },
        },
    })
    async deleteById(
        @param.path.string('id') id: string,
        @inject(SecurityBindings.USER) user: UserProfile,
    ): Promise<void> {
        const coWorking: any = await this.coWorkingRepository.findById(id, {
            include: [{relation: 'rooms'}],
        });
        if (user[securityId].localeCompare(coWorking.userId)) {
            throw new HttpErrors.Unauthorized();
        }
        if (coWorking.rooms) {
            for (let r of coWorking.rooms) {
                const room = await this.roomRepository.deleteRoom(r.id);
            }
        }
        delete coWorking.rooms;
        deleteFiles(coWorking.photo);
        await this.coWorkingRepository.delete(coWorking);
        // console.log(coWorking);
    }

    /**
     * Find ROOMS of coWorking by ID
     */
    @authenticate('jwt')
    @authorize({
        allowedRoles: ['host'],
        voters: [basicAuthorization],
    })
    @get('/co-workings/{id}/rooms', {
        responses: {
            '200': {
                description: 'Array of CoWorking has many Room',
                content: {
                    'application/json': {
                        schema: {type: 'array', items: getModelSchemaRef(Room)},
                    },
                },
            },
        },
    })
    async findRoomOfCoWorking(
        @param.path.string('id') id: string,
    ): Promise<Room[]> {
        return this.coWorkingRepository
            .rooms(id)
            .find({include: [{relation: 'service'}]});
    }

    /**
     * Find coWorking near me
     *
     */
    @authenticate('jwt')
    @authorize({
        allowedRoles: [],
        voters: [basicAuthorization],
    })
    @get('/co-workings/near')
    async findNearCoWorking(
        @param.query.number('maxDistance') maxDistance: number,
        @param.query.number('latitude') latitude: number,
        @param.query.number('longitude') longitude: number,
    ) {
        if (
            maxDistance == undefined ||
            maxDistance < 0 ||
            latitude == undefined ||
            longitude == undefined ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
        ) {
            throw new HttpErrors.BadRequest('MissingField');
        }
        const curLocation = new loopback.GeoPoint([latitude, longitude]);

        const filter: any = {
            where: {
                location: {
                    near: curLocation,
                    maxDistance: maxDistance,
                    unit: 'kilometers',
                },
            },
            include: [
                {
                    relation: 'rooms',
                    scope: {
                        include: [{relation: 'service'}],
                    },
                },
            ],
        };

        const listCoWorking = await this.coWorkingRepository.find(filter);
        return {listCoWorking};
    }
}
