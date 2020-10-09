function showNumber(i, j, randomNumber) {
    var numberCell = $('#number-cell-' + i + '-' + j);
    numberCell.css('background-color', getBackgroundColor(randomNumber));
    numberCell.css('color', getColor(randomNumber));
    numberCell.text(randomNumber);

    // console.log(numberCell);

    //生成动画
    numberCell.animate({
        width: "108px",
        height: "108px",
        top: getPosTop(i),
        left: getPosLeft(j)
    }, 50);
}

/**
 *
 * @param fromX 起始行数
 * @param fromY 起始列数
 * @param toX   目标行数
 * @param toY   目标列数
 */
function showMoveAnimation(fromX, fromY, toX, toY) {
    var numberCell = $('#number-cell-' + fromX + '-' + fromY);
    numberCell.animate({
        top: getPosTop(toX),
        left: getPosLeft(toY)
    }, 200)
}

function updateScore(score) {
    $('.score').text(score);

}

//获取上坐标
function getPosTop(i) {
    return 20 + i * 118;
}

//获取左坐标
function getPosLeft(j) {
    return 20 + j * 118;
}

function getBackgroundColor(number) {
    switch (number) {
        case 2: return '#eee4da'; break;
        case 4: return '#ede0c8'; break;
        case 8: return '#f2b179'; break;
        case 16: return '#f59563'; break;
        case 32: return '#f67c5f'; break;
        case 64: return '#f65e3b'; break;
        case 128: return '#edcf72'; break;
        case 256: return '#edcc61'; break;
        case 512: return '#9c0'; break;
        case 1024: return '#33b5e5'; break;
        case 2048: return '#09c'; break;
        case 4096: return '#a6c'; break;
        case 8192: return '#93c'; break;
    }

    return 'black';
}
//数字颜色
function getColor(number) {
    if (number <= 4) {
        return '#776e65';
    }
    return 'white';
}
//判断是否没有空格
function nospace(board) {

    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] == 0) {
                return false;
            }
        }
    }
    return true
}

//判断是否可以向左移动
function canMoveLeft(board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {

            if (board[i][j] != 0) {
                if (board[i][j - 1] == 0 || board[i][j - 1] == board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

//判断是否可以向右移动
function canMoveRight(board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {

            if (board[i][j] != 0) {
                if (board[i][j + 1] == 0 || board[i][j + 1] == board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveUp(board) {
    for (var j = 0; j < 4; j++) {
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                if (board[i - 1][j] == 0 || board[i - 1][j] == board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveDown(board) {
    for (var j = 0; j < 4; j++) {
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                if (board[i + 1][j] == 0 || board[i + 1][j] == board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}


/**
 * 作用：目标列到判断列之间有没有障碍物
 * @param row   行
 * @param col1  小列
 * @param col2  大列
 * @param board 二维数组
 */
//判断水平方向有没有障碍物
function noBlockHorizontal(row, col1, col2, board) {
    for (var i = col1 + 1; i < col2; i++) {
        if (board[row][i] != 0) {
            return false;
        }
    }
    return true;
}
//判断垂直方向有没有障碍物
function noBlockVertical(col, row1, row2, board) {
    for (var i = row1 + 1; i < row2; i++) {
        if (board[i][col] != 0) {
            return false;
        }
    }
    return true;
}

//判断还能不能动
function nomove(board) {
    if (canMoveLeft(board) || canMoveRight(board) || canMoveUp(board) || canMoveDown(board)) {
        return false;
    }
    return true;
}
//保存到本地存储
function saveData(data) {
    localStorage.setItem("bestscore", JSON.stringify(data));
}
//读取本地存储的数据
function getData() {
    let data = localStorage.getItem("bestscore");
    if (data !== null) {
        //本地存储里面的数据是字符串格式,用JSON.parse()转换为对象格式
        return JSON.parse(data);
    } else {
        return [];
    }
}

// 游戏主逻辑

var board = [];
var score = 0;
var hasConflicted = [];
var score1 = 0;

//入口函数

$(function () {
    $(".best").text(getData());
    newGame();
})

function newGame() {
    //初始化
    init();
    //在随机两个格子生成数字
    renderOneNumber();
    renderOneNumber();
}

function init() {
    //4 * 4 棋盘
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            //灰色的初始棋盘
            var gridCell = $('.box-' + i + '-' + j);
            gridCell.css('top', getPosTop(i));
            gridCell.css('left', getPosLeft(j));
        }
    }

    //生成数据格子
    for (var i = 0; i < 4; i++) {
        //初始化
        board[i] = []; //二维数组
        hasConflicted[i] = [];
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasConflicted[i][j] = false;

        }
    }

    //初始化分数
    score = 0;
    score1 = 0
    updateScore(score);

    updateBoard();
}


function updateBoard() {
    $('.number-cell').remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $('.grid-container').append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>')
            var theNumberCell = $('#number-cell-' + i + '-' + j);

            if (board[i][j] == 0) {
                //等于0就是不显示
                theNumberCell.css({
                    'width': '0px',
                    'height': '0px',
                    'top': getPosTop(i) + 50,
                    'left': getPosLeft(j) + 50
                });
            } else {
                //有数值就显示
                theNumberCell.css({
                    'width': '108px',
                    'height': '108px',
                    'top': getPosTop(i),
                    'left': getPosLeft(j),
                    'background-color': getBackgroundColor(board[i][j]),
                    'color': getColor(board[i][j])
                });
                theNumberCell.text(board[i][j]);
                if (theNumberCell.text() == 1024 || theNumberCell.text() == 2048 || theNumberCell.text() == 4096 || theNumberCell.text() == 8192) {
                    theNumberCell.css('font-size', '45px');
                }

            }

            hasConflicted[i][j] = false;
        }
    }
}


//生成数字
function renderOneNumber() {
    //判断是否有空格子
    if (nospace(board)) {
        return false;
    }

    //随机一个位置
    var randomX = parseInt(Math.floor(Math.random() * 4));
    var randomY = parseInt(Math.floor(Math.random() * 4));
    var times = 0;
    while (times < 30) {
        if (board[randomX][randomY] == 0) {
            break;
        }
        randomX = parseInt(Math.floor(Math.random() * 4));
        randomY = parseInt(Math.floor(Math.random() * 4));
        times++;
    }

    //性能优化
    if (times == 30) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] == 0) {
                    randomX = i;
                    randomY = j;
                }
            }
        }
        console.log('手动生成');
    }

    //随机一个数字
    var randomNumber = Math.random() < 0.5 ? 2 : 4; //2或4

    //在随机位置显示随机数字
    board[randomX][randomY] = randomNumber;
    showNumber(randomX, randomY, randomNumber);


    return true;
}

$(document).keydown(function (e) {
    switch (e.keyCode) {
        case 37: //左
            if (moveLeft()) {
                let num = $('.score').text() - score1;
                if(num>0){
                    add(num)
                }
                score1 = $('.score').text();
                setTimeout('renderOneNumber()', 210);
                setTimeout('isGameOver()', 300);
            }
            break;
        case 38: //上
            if (moveUp()) {
                let num = $('.score').text() - score1;
                if(num>0){
                    add(num)
                }
                score1 = $('.score').text();
                setTimeout('renderOneNumber()', 210);
                setTimeout('isGameOver()', 300);

            }
            break;
        case 39: //右
            if (moveRight()) {
                let num = $('.score').text() - score1;
                if(num>0){
                    add(num)
                }
                score1 = $('.score').text();
                setTimeout('renderOneNumber()', 210);
                setTimeout('isGameOver()', 300);

            }
            break;
        case 40: //下
            if (moveDown()) {
                let num = $('.score').text() - score1;
                if(num>0){
                    add(num)
                }
                score1 = $('.score').text();
                setTimeout('renderOneNumber()', 210);
                setTimeout('isGameOver()', 300);

            }
            break;
        default:
            break;
    }
})

//游戏是否结束
function isGameOver() {
    if (nospace(board) && nomove(board)) {
        gameover();
    }
}
//游戏结束
function gameover() {
    let score = $('.score').text();
    let bestscore = $(".best").text();
    if (score - 0 > bestscore - 0) {
        saveData(score);
        console.log(getData());
        $(".best").text(getData());
    }
    let resetGame = $('.restart-game');
    resetGame.css('display', "block");
}
//重新开始
function resetGame() {
    $(".restart-game a").click(function () {
        let resetGame = $('.restart-game');
        resetGame.css('display', "none");
        newGame();
    })
}
function moveLeft() {

    //判断是否可以左移动
    if (!canMoveLeft(board)) {
        return false;
    }
    //moveLeft
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            //如果不为0，那么他是可能向左移动的
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //加分
                        score += board[i][k];
                        updateScore(score);
                        //开关
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }

    //根据数组更新位置
    setTimeout("updateBoard()", 200);
    return true;
}

function moveRight() {

    //判断是否可以右移动
    if (!canMoveRight(board)) {
        return false;
    }

    // flag = false;
    //moveRight
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            //如果不为0，那么他是可能向右移动的
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] *= 2;
                        board[i][j] = 0;
                        //加分
                        score += board[i][k];
                        updateScore(score);
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }

    //根据数组更新位置
    setTimeout("updateBoard()", 200);
    return true;
}

function moveUp() {

    //判断是否可以上移动
    if (!canMoveUp(board)) {
        return false;
    }

    // flag = false;
    //moveUp
    for (var j = 0; j < 4; j++) {
        for (var i = 1; i < 4; i++) {
            //如果不为0，那么他是可能向上移动的
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        //加分
                        score += board[k][j];
                        updateScore(score);
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }

    //根据数组更新位置
    setTimeout("updateBoard()", 200);
    return true;
}

function moveDown() {

    //判断是否可以上移动
    if (!canMoveDown(board)) {
        return false;
    }

    // flag = false;
    //moveUp
    for (var j = 0; j < 4; j++) {
        for (var i = 2; i >= 0; i--) {
            //如果不为0，那么他是可能向下移动的
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        //加分
                        score += board[k][j];
                        updateScore(score);
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }

    //根据数组更新位置
    setTimeout("updateBoard()", 200);
    return true;
}

function add(num) {
    if (num > 0) {
        var addition = $(".addition");
        addition.css("top", "60%");
        addition.fadeIn(300);
    }
    var addition = $(".addition");
    addition.text("+" + num);
    addition.css("top", "10%");
    addition.fadeOut(300);
}