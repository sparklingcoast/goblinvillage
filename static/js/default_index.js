// This is the js for the default/index.html view.

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array.
    var enumerate = function(v) {
        var k=0;
        return v.map(function(e) {e._idx = k++;});
    };


    self.cookie_clicked = function() {
        self.vue.gold = self.vue.gold + self.vue.goldclickincrease;
        self.maxgoldcheck();
    }

    self.refresh = function() {
        self.vue.gold = self.vue.gold + self.vue.goldpersecond;
        self.maxgoldcheck();
    }

    self.auto_refresh = function () {
        setInterval(self.refresh, 1000)
    };

    self.maxgoldcheck = function () {
        if(self.vue.gold > self.vue.maxgold) {
            self.vue.maxgold = self.vue.gold;
        }
    }

    self.purchase_item = function (purchased_item) {
        for (var i = 0; i < self.vue.shop.length; i++) {
            if(self.vue.shop[i].item_name == purchased_item.item_name) {
                if(self.vue.gold >= self.vue.shop[i].price-.001) {
                    self.vue.gold -= self.vue.shop[i].price;
                    self.vue.shop[i].price *= 1.05;
                    self.vue.shop[i].amount += 1;
                    self.calculate_gps();
                }
                break;
            }
        }
    }

    self.calculate_gps = function () {
        self.vue.goldpersecond = 0;
        for (var i = 0; i < self.vue.shop.length; i++){
            self.vue.goldpersecond += self.vue.shop[i].gold_per_sec * self.vue.shop[i].amount;
        }
    }


    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            gold: 0,
            goldclickincrease: 1,
            goldpersecond: 0,
            maxgold: 0,
            shop: [{item_name:"General Store", price: 10, description: ".2 gold every second", amount: 0, gold_per_sec: .2},
            {item_name:"Jewelry Store", price: 100, description: "3 gold every second", amount: 0, gold_per_sec: 3}]
        }
        ,
        methods: {
            cookie_clicked: self.cookie_clicked,
            purchase_item: self.purchase_item
        }

    });


    self.auto_refresh();
    $("#vue-div").show();


    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
