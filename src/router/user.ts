import { User } from '../controllers';
import { IRouteConfig, RequestTypeEnum } from '../models';

const controller = new User([]);
export const routes = <IRouteConfig[]>[
  {
    name: 'api/users',
    methods: {
      [RequestTypeEnum.GET]: controller.getAll.bind(controller),
      [RequestTypeEnum.POST]: controller.create.bind(controller),
    },
  },
  {
    name: 'api/users/:id',
    methods: {
      [RequestTypeEnum.GET]: controller.get.bind(controller),
      [RequestTypeEnum.PUT]: controller.update.bind(controller),
      [RequestTypeEnum.PATCH]: controller.patch.bind(controller),
      [RequestTypeEnum.DELETE]: controller.delete.bind(controller),
    },
  },
];
