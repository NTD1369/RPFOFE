import { MFunction } from '../mfunction';

export class NodeFunctionViewModel //: MFunction
{
   
   data: MFunction;
   children: NodeFunctionViewModel[] =[];
}

export class NodeUpdateModel
{
    roleId: string;
    functionId: string;
    controlId: string;
    columnName: string;
    columnValue: boolean;
}
