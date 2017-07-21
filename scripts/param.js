/* const values */
//basic
const max_level = 14;
const interval = 10;
const gameover_time = 2000 / interval;
const level_black_interval = [2000, 1600, 1400, 1400, 1200, 1100, 1000, 
                                900, 800, 700, 650, 600, 550,
                                500, 400];
const level_speed = [2.2, 2.2, 2.4, 2.4, 2.6, 2.7, 2.8, 2.9, 3.0, 3.1, 3.2, 3.3, 3.4, 3.4, 3.6];
const level_fast_p = [0, 0.1, 0.2, 0.2, 0.3, 0.3, 0.4, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1];
const level_n = [5, 5, 5, 5, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3];
const level_num_p = [[1, 1], [0.3, 0.8], [0.2, 0.7], [0.2, 0.5], [0.3, 0.7],
                        [0.2, 0.6], [0.1, 0.5], [0.6, 1], [0.5, 1],
                        [0.4, 1], [0.3, 1], [0.2, 1], [0.1, 1], 
                        [0, 1], [0, 1]];
const level_type_p = [[1, 1, 1], [0.4, 0.8, 0.9], [0.35, 0.7, 0.85], [0.3, 0.6, 0.8],
                        [0.4, 0.8, 0.9], [0.35, 0.7, 0.85], [0.3, 0.6, 0.8],
                        [0.4, 0.8, 0.9], [0.35, 0.7, 0.85], [0.3, 0.6, 0.8],
                        [0.25, 0.5, 0.75], [0.25, 0.5, 0.75], [0.2, 0.4, 0.7],
                        [0.2, 0.4, 0.7], [0.15, 0.3, 0.65]]

//background
const width = 600;
const height = 800;
const background_color = ["#F18F82", "#FFB17F", "#71C48C", "#ABA6CF", "#359DF7",
                            "#E45920", "#849D79", "#D1B1C0", "#8AC2C3", "#9B7BD7",
                            "#F457A1", "#F8B072", "#5ECA8F", "#9D94D5", "#209FD4"];
const background_space = width / 6;
const background_move_step = width / (3000 / interval);

//board
const board_size = width / 3;
const board_x = (width - board_size) / 2;
const board_y = (height - board_size) / 2;

//elements
const black_color = "#333333";
const bonus_blue = "#1F68AF";
const bonus_yellow = "#FCFC53";

//button
const pause_x = width - 100;
const pause_y = 30;
const pause_size = 40;
const restart_x = 133;
const restart_y = 530;
const restart_width = 330;
const restart_height = 85;
const restart_r = 10;
const start_x = 170;
const start_y = 520;
const start_width = 250;
const start_height = 85;
const start_r = 10;

/* variables */
var n;
var board_r, cell_size, line_width, line_space;
var white_r, white_space;
var black_r;
var bonus_size, bonus_r;

function update_n(n_value) {
    n = n_value;
    board_r = 40 - 3 * n;
    cell_size = board_size / n;
    line_width = 5 - 0.3 * n;
    line_space = cell_size / 5;
    white_r = 0.3 * cell_size;
    white_space = 0.05 * cell_size;
    black_r = 0.4 * cell_size;
    bonus_size = 0.35 * cell_size;
    bonus_r = 0.05 * cell_size;

    var bonus_element = document.getElementById("canvas_bonus");
    bonus_element.width = cell_size;
    bonus_element.height = cell_size;
}


/* game value */
Smove = {
    game_state: 1,  //0: ready, 1: ingame, 2: pause, 3: gameover
    level: 1,
    score: 0,
    best_score: 0,
    white: undefined, 
    bonus: undefined,
    blacks: [],
    level_time: 2000 / interval,
    gameover_time: 0,
    gameover_info: "",
    background: undefined,
}
