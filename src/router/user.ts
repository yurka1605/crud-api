import { User } from './../controllers/user';
import { IRouteConfig, RequestTypeEnum } from '../models';

export function initUserRoutes() {
  const controller = new User([]);
  return <IRouteConfig[]>[
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
}
