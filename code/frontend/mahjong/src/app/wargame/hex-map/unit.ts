import { booleanAttribute } from "@angular/core";

export class Unit {
    movementSpeed: number; // 行动力（可以移动的格子数）
    // 攻击范围: 1格
    attackRange: number;
    image: string; // 兵种图片路径
    health: number; // 当前血量
    maxHealth: number; // 最大血量
    camp: string; // 阵营属性，取值为 'A' 或 'B'
    // 每个兵种攻击力下限与上限也设计成一样的,不要动态变化
    attackUpperLimit: number;
    attackLowerLimit: number;
    counterAttackChance: number=0.3;
    attackBoost: number = 0; // 攻击力加成
    healthBoost: number = 0; // 血量加成
    // hasActed: boolean = false // 是否已行动
    hasMoved: boolean = false; // 是否已移动
    hasAttacked: boolean = false; // 是否已攻击
    // 如果旁边没有敌人,则不可以攻击
    canAttack: boolean = true; // 是否可以攻击
    // 设置玩家阵营与AI阵营的camp的默认值
    static playerCamp: 'playerCamp' | 'aiCamp' = 'playerCamp';
    static aiCamp: 'playerCamp' | 'aiCamp' = 'aiCamp';

    constructor
    (movementSpeed: number, image: string, 
        health: number, maxHealth: number = health,
        camp: string,attackUpper: number = 10,attackLower: number = 5,
        counterAttackChance: number = 0.3,
        attackRange: number = 1,
        hasMoved: boolean = false,
        hasAttacked: boolean = false,
        boost :number = 1) {
        this.movementSpeed = movementSpeed;
        this.image = image;
        this.health = Math.floor(health) * boost; 
        this.maxHealth = Math.floor(maxHealth) * boost; 
        this.camp = camp; 
        this.attackUpperLimit = attackUpper * boost;
        this.attackLowerLimit = attackLower * boost;
        this.counterAttackChance = counterAttackChance;
        this.attackRange = attackRange;
    }

    boost(boost: number): void {
        this.health *= boost;
        this.maxHealth *= boost;
        this.attackUpperLimit *= boost;
        this.attackLowerLimit *= boost;
    }

    //移动速度，图片链接，当前血量，血量上限，阵营，攻击上限，攻击下限，反击概率,攻击范围（没写默认是1）
    // 创建正常的骑兵对象
    static createNormalCavalry(camp:string,boost:number=1): Unit {
        return new Unit(3, "assets/Car.png",
            100, 100, camp, 10, 5, 0.3);
    }

    // 创建正常的步兵对象
    static createNormalInfantry(camp:string,boost:number =1): Unit {
        // Infantry move speed: 2
        return new Unit(
            2, "assets/Infantry.png",
            100, 100, camp, 10, 5, 0.3,1,false,false,boost);
    }




    //创造正常的坦克对象
    static createNormalTank(camp:string,boost:number=1):Unit{
        return new Unit(4,"assets/Tank.png",200,200,camp,10,0.9,0.8,1,false,false,boost
        )
    }
    //创建重型坦克对象
    static createNormalOverweightTank(camp:string,boost:number=1):Unit{
        return new Unit(
            3,"assets/OverweightTank.png",1150,1150,camp,100,10,0.6,1,false,false,boost
        )
    }

    // 反击逻辑
    counterAttack(): number {
        const chance = Math.random();
        if (chance <= this.counterAttackChance) {
            const damage =
                Math.random() * (this.attackUpperLimit - this.attackLowerLimit) +
                this.attackLowerLimit;
            console.log(
                `Unit performed a counterattack! Damage: ${Math.floor(damage * 5)}`
            );
            return Math.floor(damage);
        }
        return 0; // 如果未触发反击，返回 0
    }

    // 方法：减血
    takeDamage(amount: number): void {
        this.health -= amount;
        if (this.health < 0) {
            this.health = 0; // 防止血量为负
        }
    }

    // 方法：增加血量
    heal(amount: number): void {
        this.health += amount;
    }

    // 攻击方法
    attack(): number {
        if (this.hasAttacked) {
            console.log("This unit has already attacked this turn.");
            return 0; // 如果已攻击过，则不能再次攻击
        }
        this.hasAttacked = true; // 标记已攻击
        console.log("Unit attackUpperLimit: " + this.attackUpperLimit + " attackLowerLimit: " + this.attackLowerLimit);
        const damage =
            Math.random() * (this.attackUpperLimit - this.attackLowerLimit) +
            this.attackLowerLimit;
        return Math.floor(damage * 5); // 返回攻击伤害
    }

    // 移动方法
    move(): boolean {
        if (this.hasMoved) {
            console.log("This unit has already moved this turn.");
            return false; // 如果已移动过，则不能再次移动
        }
        this.hasMoved = true; // 标记已移动
        return true; // 返回成功移动
    }

    // 重置行动状态
    resetAction(): void {
        this.hasMoved = false;
        this.hasAttacked = false;
    }

    static createNormalUnit(camp: string, unitType: string, boost: number = 1): Unit | null {
        switch (unitType) {
            case 'tank':
                return this.createNormalTank(camp);
            case 'overweightTank':
                return this.createNormalOverweightTank(camp);
            case 'cavalry':
                return this.createNormalCavalry(camp, boost);
            case 'infantry':
            case 'Infantry':
                return this.createNormalInfantry(camp, boost);
            default:
                return null;
        }
    }


}
