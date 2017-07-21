var g_logic = new logic;
var g_views = new views;

function logic() {
    return {
        //game about
        init: function() {
            Smove.game_state = 0;
            Smove.level = 1;
            update_n(level_n[Smove.level]);
            Smove.score = 0;
            Smove.white = g_logic.create_white();
            Smove.bonus = g_logic.create_bonus(1);
            Smove.blacks = [];
            Smove.background = g_logic.create_background();
            Smove.blacks.time = 0;
            Smove.level_time =  2000 / interval;
        },

        pause: function() {
            if(Smove.game_state === 1)
                Smove.game_state = 2;
            else if(Smove.game_state === 2)
                Smove.game_state = 1;
        },

        level_up: function() {
            if(Smove.level === max_level) {
                this.game_over();
                return;
            }
            Smove.level++;
            Smove.level_time = 2000 / interval;
            Smove.background.move = true;
            update_n(level_n[Smove.level]);
            if(level_n[Smove.level] !== level_n[Smove.level - 1]) {
                Smove.white = g_logic.create_white();
                Smove.blacks = [];
                Smove.blacks.time = 1000 / interval;
            }
            g_views.draw_all();

        },

        game_over: function() {
            Smove.game_state = 3;
            Smove.gameover_time = gameover_time;
            if(Smove.score >= Smove.best_score) {
                Smove.best_score = Smove.score;
                if(Smove.level === max_level)
                    Smove.gameover_info = "YOU WIN";
                else
                    Smove.gameover_info = "BEST";
            }
            else {
                Smove.gameover_info = "GAME OVER";
            }
        },

        //create
        create_white: function() {
            return {
                x: parseInt(n / 2),
                y: parseInt(n / 2),
            };
        },

        create_bonus: function(type) {
            var random_x, random_y;
            do {
                random_x = parseInt(Math.random() * n);
                random_y = parseInt(Math.random() * n);
            }
            while((Math.abs(random_x - Smove.white.x) + Math.abs(random_y - Smove.white.y)) <= 1
                || random_x === n || random_y === n
                || (Smove.bonus !== undefined && random_x === Smove.bonus.x && random_y === Smove.bonus.y));
            return {
                x: random_x,
                y: random_y,
                type: type,
            };
        },

        create_black: function(x_pos, y_pos, x_speed, y_speed) {
            return {
                x_pos: x_pos,
                y_pos: y_pos,
                x_speed: x_speed,
                y_speed: y_speed,
            };
        },

        create_single_black: function(direction, index, x_speed, y_speed, offset) {
            if(direction === 0) {
                if(x_speed >= 0)
                    Smove.blacks.push(this.create_black(-black_r - offset * cell_size, 
                        board_y + (index + 0.5) * cell_size, x_speed, y_speed));
                else
                    Smove.blacks.push(this.create_black(width + black_r + offset * cell_size, 
                        board_y + (index + 0.5) * cell_size, x_speed, y_speed));
            }
            else if(direction === 1) {
                if(y_speed >= 0)
                    Smove.blacks.push(this.create_black(board_x + (index + 0.5) * cell_size,
                        -black_r - offset * cell_size, x_speed, y_speed));
                else
                    Smove.blacks.push(this.create_black(board_x + (index + 0.5) * cell_size,
                        height + black_r + offset * cell_size, x_speed, y_speed));
            }
        },

        create_background: function() {
            return {
                move: false,
                y_pos: 0,
            }
        },

        //update
        update: function() {
            switch(Smove.game_state) {
                case 1:
                    bonus_update();
                    blacks_update();
                    info_update();
                    background_update();
                    break;
                case 3:
                    if(Smove.gameover_time > 0){
                        g_views.draw_all();
                        background_update();
                    }
                    break;
            }
        },

    };
}

function bonus_update() {
    if (!Smove.bonus)
        return;
    if (Smove.bonus.type > 0) {
        g_views.rotate_bonus();
        if (Smove.white.x === Smove.bonus.x && Smove.white.y === Smove.bonus.y) {
            Smove.score++;
            Smove.bonus.type = 0;
            if (Smove.score % 10 === 0) {
                Smove.bonus.time = 1000 / interval;
                g_logic.level_up();
            }
            else 
                Smove.bonus.time = 200 / interval;
            g_views.draw_bonus();
            g_views.draw_info();
        }
    } 
    else {
        Smove.bonus.time--;
        if (Smove.bonus.time <= 0) {
            if (Smove.score % 10 === 9)
                Smove.bonus = g_logic.create_bonus(2);
            else
                Smove.bonus = g_logic.create_bonus(1);
            g_views.draw_bonus();
        }
    }
}

function blacks_update() {
    blacks_create_update();
    blacks_move_update();
    g_views.draw_blacks();
}

function blacks_create_update() {
    if(Smove.blacks.time <= 0) {
        var num;
        random_num = Math.random();
        if (random_num >= 0 && random_num < level_num_p[Smove.level][0])
            num = 1;
        else if (random_num >= level_num_p[Smove.level][0] && random_num < level_num_p[Smove.level][1])
            num = 2;
        else
            num = 3;
        for (var i = 0; i < num; ++i) {
            var random_direction = Math.random() >= 0.5 ? 0 : 1;
            var random_index;
            do{
                random_index = parseInt(Math.random() * n);
            } while(random_index === n);
            var random_speed_direction = Math.random >= 0.5 ? 1 : -1;
            var speed_scale = Math.random <= level_fast_p[Smove.level] ? 2.5 : 1;
            var random_offset = Math.random >= 0.5 ? 0 : i;
            if(random_direction === 0)
                g_logic.create_single_black(random_direction, random_index, 
                    level_speed[Smove.level] * speed_scale * random_speed_direction, 0, random_offset);
            else if(random_direction === 1)
                g_logic.create_single_black(random_direction, random_index, 
                    0, level_speed[Smove.level] * speed_scale * random_speed_direction, random_offset);
        }
        Smove.blacks.time = level_black_interval[Smove.level] / interval;
    }
    else {
        Smove.blacks.time--;
    }
}

function blacks_move_update() {
    if (Smove.blacks.length === 0)
        return;
    for (var i = 0, flag = true; i < Smove.blacks.length; flag ? i++ : i) {
        black = Smove.blacks[i];
        black.x_pos += black.x_speed;
        black.y_pos += black.y_speed;
        if ((black.x_speed >= 0 && black.x_pos > width + black_r) || 
            (black.x_speed < 0 && black.x_pos < -black_r) || 
            (black.y_speed >= 0 && black.y_pos > height + black_r) || 
            (black.y_speed < 0 && black_r.y_pos < -black_r)) {
            Smove.blacks.splice(i, 1);
            flag = false;
        } 
        else {
            flag = true;
            var white_center = get_cell_center(Smove.white);
            if(Math.pow((white_center.x_coordinate - black.x_pos), 2) + 
                Math.pow((white_center.y_coordinate - black.y_pos), 2) < Math.pow((white_r + black_r), 2)) {
                g_logic.game_over();
            }
        }
    }
}

function info_update() {
    if(Smove.level_time > 0){
        Smove.level_time--;
        g_views.draw_info();
    }
}

function background_update() {
    if(Smove.game_state === 1) {
        if(Smove.background.move){
            Smove.background.y_pos += background_move_step;
            if(Smove.background.y_pos > height) {
                Smove.background.y_pos = 0;
                Smove.background.move = false;  
            }
            g_views.draw_background();
        }
    }
    else if(Smove.game_state === 3) {
        if(Smove.gameover_time > 0){
            Smove.gameover_time--;
        }
    }
}

