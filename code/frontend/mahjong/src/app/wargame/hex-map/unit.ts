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
        attackBoost: number = 0,
        healthBoost: number = 0) {
        this.movementSpeed = movementSpeed;
        this.image = image;
        this.health = Math.floor(health); 
        this.maxHealth = Math.floor(maxHealth); 
        this.camp = camp; 
        this.attackUpperLimit = attackUpper;
        this.attackLowerLimit = attackLower;
        this.counterAttackChance = counterAttackChance;
        this.attackRange = attackRange;
        this.attackBoost = attackBoost;
        this.healthBoost = healthBoost;
    }

    // 创建正常的骑兵对象
    static createNormalCavalry(camp:string = this.playerCamp): Unit {
        return new Unit(3, "assets/Car.png",
            100, 100, camp, 10, 5, 0.3);
    }

    // 创建正常的步兵对象
    static createNormalInfantry(camp:string,boost:number =1): Unit {
        // Infantry move speed: 2
        return new Unit(
            2, "assets/Infantry.png",
            (100*boost), (100*boost), camp, 10*boost, 5*boost, 0.3,1);
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
            return Math.floor(damage * 5);
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


}
