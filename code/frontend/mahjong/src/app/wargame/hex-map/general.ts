import { Unit } from "./unit";

export class general{
    // 定义 useSkill 方法，初始为 undefined
    // 传入: 所有general可能需要的数据
    useSkill: (dict?:Map<string,any> ) => void;
    name: string;
    image: string;
    skillDescription: string;

    constructor(skillFunction: (dict?:Map<string,any>) => void,name:string,image:string,skillDescription:string) {
        // 在构造函数中为 useSkill 赋值
        this.useSkill = skillFunction;
        this.name = name;
        this.image = image;
        this.skillDescription = skillDescription;
    }
    
}

// 创建 SkillUser 类的实例，并传入具体的 useSkill 实现
export const guderian = new general(guderianSkill, "guderian", 'assets/generals/guderian.png', 'Tanks add 1 attack per turn');

function guderianSkill(dict?:Map<string,any>){
    // 拿出所有的units
    var units:Unit[] = dict?.get("units");
    for(let unit of units){
        unit.attackLowerLimit+=1;
        unit.attackUpperLimit+=1;
    }
    // console.log('使用技能：闪电战');
}

// guderian.useSkill();

