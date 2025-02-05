// src/app/wargame/hexagon.ts
import { Unit } from './unit';
export class City {
    name: string|null; // 城市名称
    type: string; // 城市类型（如 "village", "capital"）
    level: number; // 城市等级
    resources: number; // 城市资源产量
    population?: number; // 可选，城市人口
    image: string|null; // 城市图片
    camp: string|null; // 城市所属阵营
    levelToIncome = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
    // 收入和level挂钩


   

    //创建constructor
    constructor(cityName: string, type: string, level: number, resources: number, population?: number,image:string|null=null,
        camp:string|null=null) {
        this.name = cityName;
        this.type = type;
        this.level = level;
        this.resources = resources;
        this.population = population;
        this.image = image;
        this.camp = camp;
    }

}

export class Hexagon {
    x: number; // 六边形的x坐标
    y: number; // 六边形的y坐标
    size: number; // 六边形的大小
    color: string = 'gray'; // 六边形的颜色
    // image: 跟着unit走
    // 要让unit可以是null
    unit: Unit | null=null; // 兵种信息
    city?: City|null; // 城市对象，存在即表示有城市

    constructor(x: number, y: number, size: number, 
        color: string,
        unit:Unit|null=null,city:City|null=null) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.unit = unit;
        this.city = city;
    }
    // 获取相邻蜂巢的中心点
    getNeighbors(): { x: number; y: number }[] {
        const width = 2 * this.size; // 六边形宽度
        const height = Math.sqrt(3) * this.size; // 六边形高度
        const xChange = width * 3 / 4; // x轴的变化量
        const yChange = height / 2; // y轴的变化量

        return [
            { x: this.x, y: this.y - height }, // 上侧
            { x: this.x, y: this.y + height }, // 下侧
            { x: this.x - xChange, y: this.y - yChange }, // 左上侧
            { x: this.x + xChange, y: this.y - yChange }, // 右上侧
            { x: this.x - xChange, y: this.y + yChange }, // 左下侧
            { x: this.x + xChange, y: this.y + yChange }, // 右下侧
        ];
    }

    getNodesInDistance(startX: number, startY: number, size:number,n: number): { x: number; y: number }[] {
        var result: { x: number; y: number }[] = [];
        for(let i = 1; i <= n; i++) {
            result =result.concat(this.getNodesAtDistanceBFS(startX, startY, size, i));
        }
        return result;
    }

    getNodesAtDistanceBFS(startX: number, startY: number, size: number, n: number): { x: number; y: number }[] {
        const width = 2 * size; // 六边形宽度
        const height = Math.sqrt(3) * size; // 六边形高度
        const xChange = width * 3 / 4; // x轴的变化量
        const yChange = height / 2; // y轴的变化量

        // 队列初始化
        const queue: { x: number; y: number; distance: number }[] = [{ x: startX, y: startY, distance: 0 }];
        const visited = new Set<string>(); // 用于存储访问过的点
        const result: { x: number; y: number }[] = [];

        while (queue.length > 0) {
            const current = queue.shift()!;
            const { x, y, distance } = current;

            // 如果距离达到了 n，加入结果
            
            if (distance === n) {
                result.push({ x, y });
            }

            // 如果距离大于 n，停止搜索
            if (distance >= n) {
                continue;
            }

            // 标记当前点为已访问
            visited.add(`${x},${y}`);

            // 获取相邻节点
            const neighbors = [
                { x: x, y: y - height }, // 上侧
                { x: x, y: y + height }, // 下侧
                { x: x - xChange, y: y - yChange }, // 左上
                { x: x + xChange, y: y - yChange }, // 右上
                { x: x - xChange, y: y + yChange }, // 左下
                { x: x + xChange, y: y + yChange }, // 右下
            ];

            // 遍历邻居
            for (const neighbor of neighbors) {
                const neighborKey = `${neighbor.x},${neighbor.y}`;
                if (!visited.has(neighborKey)) {
                    // 加入队列，并记录距离
                    queue.push({ x: neighbor.x, y: neighbor.y, distance: distance + 1 });
                    visited.add(neighborKey); // 防止重复加入
                }
            }
        }

        return result;
    }


    

    // 获取六边形的顶点坐标
    getVertices(): [number, number][] {
        const angle = Math.PI / 3; // 60度

        let vertices: [number, number][] = [];
        for (let i = 0; i < 6; i++) {
            let theta = angle * i;
            let px = this.x + this.size * Math.cos(theta);
            let py = this.y + this.size * Math.sin(theta);
            vertices.push([px, py]);
        }

        return vertices;
    }
}
