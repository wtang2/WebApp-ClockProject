 
/* hashchange event -> URL that follows the # symbol has changed */
$(window).on('hashchange', function () {

    var hash = window.location.hash; /* URL of window after the # symbol*/

    hidePageWithId('#worldclock');
    hidePageWithId('#timer');
    hidePageWithId('#stopwatch');


    $('.page').removeClass('show');

    $('#worldclock').addClass('show');

    if (hash === '#stopwatch') { /* === -> equal values, equal types */
        $('#stopwatch').addClass('show');
        //make it red
        $('#sw').addClass('selected');
    }
    if (hash === '#worldclock') {
        $('#worldclock').addClass('show');
        $('#wc').addClass('selected');
    }
    if (hash === '#timer') {
        $('#timer').addClass('show');
        $('#tm').addClass('selected');
    }


});


function handlePage() {


    var hash = window.location.hash;

    hidePageWithId('#worldclock');
    hidePageWithId('#timer');
    hidePageWithId('#stopwatch');


    $('.page').removeClass('show');

    $('#timer').addClass('show');

    if (hash === '#stopwatch') {
        $('#stopwatch').addClass('show');
        //make it red
        $('#sw').addClass('selected');
    }
    if (hash === '#worldclock') {
        $('#worldclock').addClass('show');
        $('#wc').addClass('selected');
    }
    if (hash === '#timer') {
        $('#timer').addClass('show');
        $('#tm').addClass('selected');
    }

}

function hidePageWithId(id) {


    $(id + '-link').removeClass('selected');
}

function addPrefix(num) {
    if (num < 10) {
        num = '0' + num;
    }
    return num;
}

//-------------------------------World Clock------------------------------------


var WorldClock = {


    setWorldClock: function () {

        $('.worldclock-list').empty(); /* remove child nodes from all class name: 'worldclock-list' */
        var data = this.worldClockdata;
        $.each(data, function (index, value) {
            var currTime = new Date(); /* creates a new date object */
            var n = currTime.getTimezoneOffset(); /* */
            var ahead = (value.timezoneOffset + n) / 60;
            var gap = currTime.getHours() + ahead; 
            currTime.setHours(gap); 


            var today_tmr = '';
            var time_str = '';
            var ahead_time = '';

            if (gap > 24) {
                today_tmr = 'Tomorrow';
            } else {
                today_tmr = 'Today';
            }

            if (ahead !== 0) {
                ahead_time = ', ';
                if (ahead > 0) {
                    ahead_time += ahead + ' hours ahead';
                } else {
                    ahead_time += ahead + ' hours late';
                }

            }

            //change to 12 hour-format
            var hour = currTime.getHours();
            var min = currTime.getMinutes();
            var second = currTime.getSeconds();
            if (hour >= 12) {
                time_str = 'PM';
            } else {
                time_str = 'AM';
            }

            hour = hour % 12; // hour [0, 11]
            if (hour === 0) {
                hour += 12; 
            }

            // exp: 12 : 59 : 59 AM
            time_str = hour + ':' + addPrefix(min) + ':' + addPrefix(second) + ' ' + time_str;

            $('.worldclock-list').append('<li><p class="city">'
            + value.cityName
            + '</p><p class="time-details"><strong>'
            + today_tmr + '</strong>'
            + ahead_time + '</p><p class="time">'
            + time_str + '</p></li>');

        });


    },

    updateTime: function () {

        // every 0.5 seconds, setWorldClock()
        setInterval(function () {

            WorldClock.setWorldClock();
        }, 500);

    },

    init: function () {

        this.worldClockdata = [
            {
                cityName: 'Cupertino',
                timezoneOffset: -480
            },
            {
                cityName: 'Stockholm',
                timezoneOffset: 60
            },
            {
                cityName: 'São Paulo',
                timezoneOffset: -180
            },
            {
                cityName: 'Tokyo',
                timezoneOffset: 540
            },
            {
                cityName: 'New York',
                timezoneOffset: -300
            },
            {
                cityName: 'Bucharest',
                timezoneOffset: 120
            },
            {
                cityName: 'Beijing',
                timezoneOffset: 480
            }


        ];

        this.setWorldClock();
        this.updateTime();

    }

};

//--------------------Timer----------------------------

var Timer = {

    timeLeft: 0,
    isRunning: false,
    timeInterval: 500,

    leftButton: function () {

        if (this.isRunning != true) {
            this.start();
        } else {
            this.cancel();
        }

    },

    rightButton: function () {

        if (this.isRunning != true) {
            this.resume();
        } else {
            this.pause();
        }

    },

    start: function () {

        var timeDuration = $('#timer .inputs .hours').val() * 3600000 + $('#timer .inputs .minutes').val() * 60000;

        //console.log(timeDuration);
        if (timeDuration != 0) {
            $('#timer .left-button').html('Cancel').removeClass('button-start').addClass('button-cancel');
            $('#timer .right-button').removeClass('disabled').addClass('button-pause').html('Pause');

            $('#timer .counter').show();
            $('#timer .inputs').hide();
            this.timeLeft = timeDuration;
            this.isRunning = true;
            this.calculateTime();

        }


    },

    cancel: function () {
        $('#timer .left-button').html('Start').removeClass('button-cancel').addClass('button-start');
        $('#timer .right-button').html('Pause').removeClass('button-pause').addClass('disable');

        $('#timer .counter').hide();
        $('#timer .inputs').show();
        this.isRunning = false;
        this.timeLeft = 0;

    },

    pause: function () {
        $('#timer .right-button').html('Resume');
        this.isRunning = false;

    },

    resume: function () {
        if (!$("#timer .right-button").hasClass('disabled')) {
            $("#timer .right-button").html('Pause');
            this.isRunning = true;
            this.calculateTime();
        }
    },


    calculateTime: function () {

        if (this.isRunning) {

            var tempTimeLeft = this.timeLeft,
                newTimeLeft = tempTimeLeft - this.timeInterval,
                self = this;


            this.timeLeft = newTimeLeft;

            if(newTimeLeft <=0){

                this.cancel();
                return;

            }
            var hours = parseInt(newTimeLeft / 3600000, 10), // parses a string argument and returns an integer
                minutes = parseInt(newTimeLeft / 60000, 10) - hours * 60,
                seconds = parseInt(newTimeLeft / 1000, 10) - minutes * 60 - hours * 3600,
                totalTime = '';

            if (hours) {
                totalTime += hours + ':';
            }

            totalTime += addPrefix(minutes) + ':' + addPrefix(seconds);

            $('.total-time').html(totalTime);

            //console.log(totalTime);
            // setTimeout: calculate time() after this.timeInterval()
            setTimeout(function () {
                self.calculateTime();
            },this.timeInterval);
        }
    },

    init: function () {
        var self = this;

        $('#timer .left-button').click(function () {
            self.leftButton();
        });
        $('#timer .right-button').click(function () {
            self.rightButton()

        });

    }

};


//--------------------Stopwatch----------------------------

var Stopwatch = {

    isRunning: false,
    startTime: null,
    lapTime: null,
    ellapsedTime: 0,
    ellapsedlapTime: 0,
    timeInterval: 10,

    handleLeftButton: function () {
        if (this.isRunning) {// this is global or in function
            this.stop();
        } else {
            this.start();
        }
    },

    handleRightButton: function () {
        if (this.isRunning) {
            this.lap();
        } else {
            this.reset();
        }
    },

    start: function () {
        var self = this;
        $('#stopwatch .left-button').removeClass('button-start').addClass('button-stop').html('Stop');
        $('#stopwatch .right-button').removeClass('disabled').addClass('button-lap').html('Lap');

        self.startTime = new Date().getTime();
        self.lapTime = new Date().getTime();

        self.startTime -= self.ellapsedTime;
        self.lapTime -= self.ellapsedlapTime;

        this.isRunning = true;

        setTimeout(function () {
            self.handleTimer();
        }, this.timeInterval);

    },

    stop: function () {
        this.isRunning = false;
        $('#stopwatch .left-button').removeClass('button-stop').addClass('button-start').html('Start');
        $('#stopwatch .right-button').removeClass('button-lap-enabled').addClass('button-reset').html('Reset');
    },

    lap: function () {
        var lapTime = this.lapTime;

        $('#stopwatch ul').prepend([
            '<li>',
            '<p class="lap-label">Lap', $('#stopwatch ul').children().length + 1, '</p>',
            '<p class="lap-time">', this.formatTimeFormMilliseconds(new Date().getTime() - lapTime), '</p>',
            '</li>'
        ].join(''));

        this.lapTime = new Date().getTime();
    },

    reset: function () {
        this.ellapsedTime = 0;
        this.ellapsedlapTime = 0;
        $('#stopwatch .counter .total-time').html(this.formatTimeFormMilliseconds(0));
        $('#stopwatch .counter .lap-time').html(this.formatTimeFormMilliseconds(0));
        $('#stopwatch ul').html('');
        $('#stopwatch .right-button').removeClass('button-lap-enabled').removeClass('button-reset').addClass('disabled').html('Lap');
    },

    handleTimer: function () {
        var now = new Date().getTime(),
            startTime = this.startTime,
            lapTime = this.lapTime,
            self = this;

        $('#stopwatch .counter .total-time').html(this.formatTimeFormMilliseconds(now - startTime));
        $('#stopwatch .counter .lap-time').html(this.formatTimeFormMilliseconds(now - lapTime));

        self.ellapsedTime = now - startTime;
        self.ellapsedlapTime = now - lapTime;

        if (self.isRunning) {
            setTimeout(function () {
                self.handleTimer();
            }, this.timeInterval);
        }
    },

    formatTimeFormMilliseconds: function (milliseconds) {

        var minutes = parseInt((milliseconds / 60 / 1000), 10),
            seconds = parseInt(milliseconds / 1000, 10) - minutes * 60,
            tenths = parseInt((milliseconds - seconds * 1000 - minutes * 60000) / 10, 10);

        return addPrefix(minutes) + ':' + addPrefix(seconds) + '.' + addPrefix(tenths);
    },

    init: function () {

        var self = this;
        $('#stopwatch .left-button').click(function () {
            self.handleLeftButton();
        });

        $('#stopwatch .right-button').click(function () {
            self.handleRightButton();
        });

    }
};
