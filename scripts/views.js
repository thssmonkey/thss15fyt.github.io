function views() {

    return {

        draw_all: function() {
            var c = document.getElementById("canvas_center");
            var ctx = c.getContext("2d");
            this.draw_background();
            this.draw_white();
            this.draw_bonus();
            this.draw_blacks();
            this.draw_info();
            this.draw_button();
        },

        draw_background: function() {
            var c = document.getElementById("canvas_center");
            var ctx = c.getContext("2d");
            ctx.clearRect(0, 0, width, height);
            ctx.globalAlpha = 1;
            if(Smove.game_state === 3 && Smove.gameover_time > 0) {
                ctx.save();
                var center_x = board_x + (n / 2) * cell_size;
                var center_y = board_y + (n / 2) * cell_size;
                ctx.translate(center_x, center_y);
                ctx.rotate((gameover_time - Smove.gameover_time) * (Math.PI / 1800));
                ctx.scale(Math.pow(1.01, (gameover_time - Smove.gameover_time)), 
                    Math.pow(1.01, (gameover_time - Smove.gameover_time)));
                ctx.translate(-center_x, -center_y);
            }
            //background-color
            function draw_single_background(ctx, y, color1, color2) {
                ctx.fillStyle = color1;
                ctx.fillRect(0, y, width, height);
                var grd = ctx.createLinearGradient(0, y + height - background_space, 0, y + height + 50);
                grd.addColorStop(0, color1);
                grd.addColorStop(1, color2);
                ctx.fillStyle = grd;
                ctx.fillRect(0, y + height - background_space, width, background_space + 50);
            }
            
            if(Smove.background.move) {
                draw_single_background(ctx, Smove.background.y_pos, 
                    background_color[Smove.level - 1], background_color[Smove.level - 2]);
                draw_single_background(ctx, Smove.background.y_pos - height,
                    background_color[Smove.level], background_color[Smove.level - 1]);
            }
            else {
                draw_single_background(ctx, Smove.background.y_pos, 
                    background_color[Smove.level], background_color[Smove.level - 1]);
            }
            //board
            //board-roundRect
            ctx.beginPath();
            ctx.lineWidth = line_width.toString();
            ctx.strokeStyle = "white";
            ctx.globalAlpha = 0.8;
            ctx.moveTo(board_x + board_r, board_y);
            ctx.lineTo(board_x + board_size - board_r, board_y);
            ctx.arcTo(board_x + board_size, board_y, board_x + board_size, board_y + board_r, board_r);
            ctx.lineTo(board_x + board_size, board_y + board_size - board_r);
            ctx.arcTo(board_x + board_size, board_y + board_size, board_x + board_size - board_r, board_y + board_size, board_r);
            ctx.lineTo(board_x + board_r, board_y + board_size);
            ctx.arcTo(board_x, board_y + board_size, board_x, board_y + board_size - board_r, board_r);
            ctx.lineTo(board_x, board_y + board_r);
            ctx.arcTo(board_x, board_y, board_x + board_r, board_y, board_r);
            ctx.stroke();
            //board-lines
            ctx.lineWidth = "3";
            ctx.globalAlpha = 0.5;
            for(i = 1; i <= n - 1; ++i) {
                ctx.beginPath();
                ctx.moveTo(board_x + line_space, board_y + i * cell_size);
                ctx.lineTo(board_x + board_size - line_space, board_y + i * cell_size);
                ctx.stroke();
            }
            for(i = 1; i <= n - 1; ++i) {
                ctx.beginPath();
                ctx.moveTo(board_x + i * cell_size, board_y + line_space);
                ctx.lineTo(board_x + i * cell_size, board_y + board_size - line_space);
                ctx.stroke();
            }
            if(Smove.game_state === 3 && Smove.gameover_time > 0) {
                ctx.restore();
            }
        },

        draw_white: function() {
            var c = document.getElementById("canvas_white");
            var ctx = c.getContext("2d");
            ctx.clearRect(0, 0, width, height);
            if(Smove.white === undefined)
                return;
            if(Smove.game_state === 3 && Smove.gameover_time > 0) {
                ctx.save();
                var center_x = board_x + (n / 2) * cell_size;
                var center_y = board_y + (n / 2) * cell_size;
                ctx.translate(center_x, center_y);
                ctx.rotate((gameover_time - Smove.gameover_time) * (Math.PI / 1800));
                ctx.scale(Math.pow(1.01, (gameover_time - Smove.gameover_time)), 
                    Math.pow(1.01, (gameover_time - Smove.gameover_time)));
                ctx.translate(-center_x, -center_y);
            }
            ctx.fillStyle = "white";
            ctx.globalAlpha = 1;
            ctx.beginPath();
            center = get_cell_center(Smove.white);
            ctx.arc(center.x_coordinate, center.y_coordinate, white_r, 0, 2 * Math.PI, true);
            ctx.closePath();
            ctx.fill();
            if(Smove.game_state === 3 && Smove.gameover_time > 0) {
                ctx.restore();
            }
        },

        draw_bonus: function() {
            var c = document.getElementById("canvas_bonus");
            var ctx = c.getContext("2d");
            ctx.clearRect(0, 0, width, height);
            if(Smove.bonus === undefined)
                return;
            if(Smove.game_state === 3 || Smove.bonus.type === 0)
                return;
            var color;
            if(Smove.bonus.type === 1)
                color = bonus_blue;
            else if(Smove.bonus.type === 2)
                color = bonus_yellow;
            center = get_cell_center(Smove.bonus);
            c.style.left = (center.x_coordinate - cell_size/2).toString() + "px";
            c.style.top = (center.y_coordinate - cell_size/2).toString() + "px";
            draw_round_rect(ctx, (cell_size - bonus_size)/2, (cell_size - bonus_size)/2, 
                bonus_size, bonus_size, bonus_r, color, 1);
        },

        draw_blacks: function() {
            var c = document.getElementById("canvas_blacks");
            var ctx = c.getContext("2d");
            ctx.clearRect(0, 0, width, height);
            if(Smove.blacks.length === 0)
                return;
            if(Smove.game_state === 3 && Smove.gameover_time > 0) {
                ctx.save();
                var center_x = board_x + (n / 2) * cell_size;
                var center_y = board_y + (n / 2) * cell_size;
                ctx.translate(center_x, center_y);
                ctx.rotate((gameover_time - Smove.gameover_time) * (Math.PI / 1800));
                ctx.scale(Math.pow(1.01, (gameover_time - Smove.gameover_time)), 
                    Math.pow(1.01, (gameover_time - Smove.gameover_time)));
                ctx.translate(-center_x, -center_y);
            }
            ctx.fillStyle = black_color;
            for(black of Smove.blacks) {
                ctx.beginPath();
                ctx.arc(black.x_pos, black.y_pos, black_r, 0, 2 * Math.PI, true);
                ctx.closePath();
                ctx.fill();
            }
            if(Smove.game_state === 3 && Smove.gameover_time > 0) {
                ctx.restore();
            }
        },

        draw_info: function() {
            var c = document.getElementById("canvas_info");
            var ctx = c.getContext("2d");
            ctx.clearRect(0, 0, width, height);
            ctx.globalAlpha = 1;
            //score
            if(Smove.game_state === 1 || Smove.game_state === 2){
                ctx.fillStyle = "white";
                ctx.font = "100 40px Helvetica";
                ctx.fillText("BEST : " + Smove.best_score.toString(), 30, 60);
                ctx.font = "100 120px Helvetica";
                ctx.fillText(Smove.score.toString(), 30, 170);
                //level
                if(Smove.level_time > 0) {
                    var half_time = 1000 / interval;
                    ctx.globalAlpha = (half_time - Math.abs(Smove.level_time - half_time)) / half_time;
                    ctx.font = "100 50px Helvetica";
                    ctx.fillText("LEVEL " + Smove.level.toString(), 210, 250);
                }
            }
            if(Smove.game_state === 2) {
                ctx.fillStyle = background_color[Smove.level];
                ctx.globalAlpha = 0.5;
                ctx.fillRect(0, 0, width, height);
                ctx.globalAlpha = 1;
                ctx.fillStyle = "white";
                ctx.font = "100 110px Helvetica";
                ctx.fillText("PAUSED", 90, 430);
            }
            if(Smove.game_state === 3) {
                ctx.fillStyle = background_color[Smove.level];
                ctx.globalAlpha = 0.5;
                ctx.fillRect(0, 0, width, height);
                ctx.globalAlpha = 1;
                ctx.fillStyle = "white";
                ctx.font = "100 60px Helvetica";
                var info_x = 300 - Smove.gameover_info.toString().length * 18;
                ctx.fillText(Smove.gameover_info, info_x, 190);
                ctx.font = "100 200px Helvetica";
                var score_x = 300 - Smove.score.toString().length * 55;
                ctx.fillText(Smove.score.toString(), score_x, 450);
            }
        },

        draw_button: function() {
            var c = document.getElementById("canvas_button");
            var ctx = c.getContext("2d");
            ctx.clearRect(0, 0, width, height);
            if(Smove.game_state === 1 || Smove.game_state === 2) {
                ctx.globalAlpha = 1;
                ctx.fillStyle = "white";
                ctx.fillRect(pause_x + 10, pause_y, 3, pause_size);
                ctx.fillRect(pause_x + 30, pause_y, 3, pause_size);
            }
            else if(Smove.game_state === 3) {
                draw_round_rect(ctx, restart_x, restart_y, 
                    restart_width, restart_height, restart_r, "white", 1);
                ctx.globalAlpha = 1;
                ctx.fillStyle = "#59B66F";
                ctx.font = ("100 60px Helvetica");
                ctx.fillText("RESTART", 170, 595);
            }
        },

        rotate_bonus: function() {
            if(Smove.bonus === undefined)
                return;
            var c = document.getElementById("canvas_bonus");
            var ctx = c.getContext("2d");
            ctx.clearRect(0, 0, width, height);
            if(Smove.game_state === 3 || Smove.bonus.type === 0)
                return;
            ctx.translate(cell_size/2,cell_size/2);
            ctx.rotate(Math.PI/360);
            ctx.translate(-cell_size/2,-cell_size/2);
            var color;
            if(Smove.bonus.type === 1)
                color = bonus_blue;
            else if(Smove.bonus.type === 2)
                color = bonus_yellow;
            center = get_cell_center(Smove.bonus);
            draw_round_rect(ctx, (cell_size - bonus_size)/2, (cell_size - bonus_size)/2, 
                bonus_size, bonus_size, bonus_r, color, 1);
        }
    };
}

function get_cell_center(input) {
    var x = board_x + (input.x + 0.5) * cell_size;
    var y = board_y + (input.y + 0.5) * cell_size;
    if(input.x === 0)
        x += white_space;
    else if(input.x === n - 1)
        x -= white_space;
    if(input.y === 0)
        y += white_space;
    else if(input.y === n - 1)
        y -= white_space;
    return {
        x_coordinate: x,
        y_coordinate: y
    };
}

function draw_round_rect(ctx, rect_x, rect_y, rect_width, rect_height, rect_r, color, globalAlpha) {
    ctx.fillStyle = color;
    ctx.globalAlpha = globalAlpha;
    ctx.beginPath();
    ctx.moveTo(rect_x + rect_r, rect_y);
    ctx.lineTo(rect_x + rect_width - rect_r, rect_y);
    ctx.arcTo(rect_x + rect_width, rect_y, rect_x + rect_width, rect_y + rect_r, rect_r);
    ctx.lineTo(rect_x + rect_width, rect_y + rect_height - rect_r);
    ctx.arcTo(rect_x + rect_width, rect_y + rect_height, rect_x + rect_width - rect_r, rect_y + rect_height, rect_r);
    ctx.lineTo(rect_x + rect_r, rect_y + rect_height);
    ctx.arcTo(rect_x, rect_y + rect_height, rect_x, rect_y + rect_height - rect_r, rect_r);
    ctx.lineTo(rect_x, rect_y + rect_r);
    ctx.arcTo(rect_x, rect_y, rect_x + rect_r, rect_y, rect_r);
    ctx.fill();
}