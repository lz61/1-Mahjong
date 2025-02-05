from PIL import Image

# 打开原始图像
image = Image.open('cards.png')

# 获取每张牌的宽度和高度
card_width = image.width // 9
card_height = image.height // 4

# getcardname
def get_card_name(row, col):
    if row == 0:
        return f'character_{col + 1}'
    elif row == 1:
        return f'dot_{col + 1}'
    elif row == 2:
        return f'bamboo_{col + 1}'
    else:
        if col == 0:
            return 'east'
        elif col == 1:
            return 'south'
        elif col == 2:
            return 'west'
        elif col == 3:
            return 'north'
        elif col == 4:
            return 'white dragon'
        elif col == 5:
            return 'green dragon'
        elif col == 6:
            return 'red dragon'
        else:
            return 'nothing'

def cut_image():
    # 循环切分图像
    for row in range(4):
        for col in range(9):
            left = col * card_width
            upper = row * card_height
            right = left + card_width
            lower = upper + card_height
            card_image = image.crop((left, upper, right, lower))
            # create name of card due to row and col
            # row 0: character 
            # row 1: dot
            # row 2: bamboo
            # row 3: "nothing"

            # col 0-8: 1-9(if row!=3)
            # col 0-8: east,south,west,north,white dragon,green dragon,red dragon(if row==3)

            card_image.save(f'cards/'+get_card_name(row,col)+'.png')

# 把所有图片的名字保存到文件中
def save_image_names():
    with open('cards.txt', 'w') as f:
        for row in range(4):
            for col in range(9):
                f.write(get_card_name(row, col) + '\n')

if __name__ == '__main__':
    save_image_names()