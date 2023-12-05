
export class ProgressModel
{
   num: number;
   code: string;
   value: string;
   description: string;
   icon: string;
   pass: boolean;

}
export class LoadingProgressModel
{
   loadCompleted: boolean;
   message: string;
   data: ProgressModel;
   progressList: ProgressModel[];
}