g_views = new views;
g_logic = new logic;
Smove_element = document.getElementById("center");

(function init() {
    g_logic.init();
    set_canvas_elements();
    touch_event();
    g_views.draw_all();
    timeCount();
})();

function timeCount(){
    g_logic.update();
    setTimeout("timeCount()", interval);
}

function keydown_operations(event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if(e) {
        code = e.keyCode;
        if(Smove.game_state === 1){
            //left
            if((code === 37 || code === 65) && Smove.white.x > 0)
                Smove.white.x--;
            //up
            else if((code === 38 || code === 87) && Smove.white.y > 0)
                Smove.white.y--;
             //right
            else if((code === 39 || code === 68) && Smove.white.x < n - 1)
                Smove.white.x++;
            //down
            else if((code === 40 || code === 83) && Smove.white.y < n - 1)
                Smove.white.y++;
            g_views.draw_white();            
            }
        if(code === 32) {
            if(Smove.game_state === 1 || Smove.game_state === 2) {
                g_logic.pause();
                g_views.draw_info();
            }
            else if(Smove.game_state === 3) {
                g_logic.init();
                g_views.draw_all();
            }
        }
    }
}

function click_operations(event) {
    x = event.clientX - Smove_element.offsetLeft;
    y = event.clientY - Smove_element.offsetTop;
    if((Smove.game_state === 1 || Smove.game_state === 2) 
        && x >= pause_x && x <= pause_x + pause_size
        && y >= pause_y && y <= pause_y + pause_x) {
        g_logic.pause();
        g_views.draw_info();
    }
    else if(Smove.game_state === 3
        && x >= restart_x && x <= restart_x + restart_x + width 
        && y >= restart_y && y <= restart_y + restart_height) {
        g_logic.init();
        g_views.draw_all();
    }
}

var begin_x, begin_y, end_x, end_y;

function touch_event() {
    Smove_element.addEventListener('touchstart', function(event) {
        if(event.cancelable) {
            if(!event.defaultPrevented) {
                event.preventDefault();
            }
        }
        begin_x = event.touches[0].pageX;
        begin_y = event.touches[0].pageY;
        if ((Smove.game_state === 1 || Smove.game_state === 2) 
            && begin_x >= pause_x && begin_x <= pause_x + pause_size && begin_y >= pause_y && begin_y <= pause_y + pause_x) {
            g_logic.pause();
            g_views.draw_info();
        } 
        else if (Smove.game_state === 3 && begin_x >= restart_x && begin_x <= restart_x + restart_x + width 
            && begin_y >= restart_y && begin_y <= restart_y + restart_height) {
            g_logic.init();
            g_views.draw_all();
        }        
    });
    Smove_element.addEventListener('touchend', function(event) {
        if(event.cancelable) {
            if(!event.defaultPrevented) {
                event.preventDefault();
            }
        }
        end_x = event.changedTouches[0].pageX;
        end_y = event.changedTouches[0].pageY;
        if (Math.abs(begin_x - end_x) > Math.abs(begin_y - end_y) && Math.abs(begin_x - end_x) >= 20) {
            if (end_x > begin_x && Smove.white.x < n - 1)
                Smove.white.x++;
            else if (end_x < begin_x && Smove.white.x > 0)
                Smove.white.x--;
            g_views.draw_white();
        } 
        else if (Math.abs(begin_x - end_x) <= Math.abs(begin_y - end_y) && Math.abs(begin_y - end_y) >= 20) {
            if (end_y < begin_y && Smove.white.y > 0)
                Smove.white.y--;
            else if (end_y > begin_y && Smove.white.y < n - 1)
                Smove.white.y++;
            g_views.draw_white();
        }
    });
}

function set_canvas_elements() {
    //bonus
    var bonus_element = document.getElementById("canvas_bonus");
    bonus_element.width = cell_size;
    bonus_element.height = cell_size;
    //white
    var white_element = document.getElementById("canvas_white");
    white_element.width = width;
    white_element.height = height;
    //blacks
    var blacks_element = document.getElementById("canvas_blacks");
    blacks_element.width = width;
    blacks_element.height = height;    
    //info
    var info_element = document.getElementById("canvas_info");
    info_element.width = width;
    info_element.height = height;
    //button
    var button_element = document.getElementById("canvas_button");
    button_element.width = width;
    button_element.height = height;
}