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
        setInterval(self.update_village, 10000)
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
                    self.vue.goblins += 1;
                    self.calculate_gps();
                }
                return;
            }
        }
        for (var i = 0; i < self.vue.mines.length; i++) {
            if (self.vue.mines[i].item_name == purchased_item.item_name) {
                if (self.vue.gold >= self.vue.mines[i].price - .001) {
                    self.vue.gold -= self.vue.mines[i].price;
                    self.vue.mines[i].price *= 1.05;
                    self.vue.mines[i].amount += 1;
                    self.vue.weapons += 1;
                    self.calculate_per_click();
                }
                return;
            }
        }
    }

    self.calculate_gps = function () {
        self.vue.goldpersecond = 0;
        for (var i = 0; i < self.vue.shop.length; i++){
            self.vue.goldpersecond += self.vue.shop[i].gold_per_sec * self.vue.shop[i].amount;
        }
    }

    self.calculate_per_click = function () {
        self.vue.goldclickincrease = 1;
        for (var i = 0; i < self.vue.mines.length; i++){
            self.vue.goldclickincrease += self.vue.mines[i].gold_per_click * self.vue.mines[i].amount;
        }
    }
    
    self.get_village = function () {
        $.getJSON(get_village_url, function (data) {
            console.log(data);
            if(data.village=="None") return;
            village = JSON.parse(data.village);
            self.vue.gold = village.gold;
            self.vue.goldclickincrease = village.goldclickincrease;
            self.vue.goldpersecond = village.goldpersecond;
            self.vue.maxgold = village.maxgold;
            self.vue.goblins = village.goblins;
            self.vue.weapons = village.weapons;
            self.vue.shop = village.shop;
            self.vue.mines = village.mines;
        })
    }
    
    self.get_villages = function () {
        $.getJSON(get_other_villages_url, function (data) {
            var unlucky_village = JSON.parse(data.unlucky_village);
            if(self.vue.attacking) {
                self.vue.attacking_gps = 0;
                for (var i = 0; i < unlucky_village.shop.length; i++){
                    self.vue.attacking_gps += unlucky_village.shop[i].gold_per_sec * unlucky_village.shop[i].amount;
                }
                self.vue.goldpersecond += self.vue.attacking_gps;
                self.vue.attacking = false;
                self.vue.fight_ended = true;
            }
            else {
                self.vue.attacking_village_name = data.user_name;
                self.vue.attacking_power = unlucky_village.goblins+unlucky_village.weapons;
                self.vue.attacking = true;
            }

        })
    }

    self.update_village = function () {
        console.log(self.vue);
        $.post(update_village_url,
            {
                village: JSON.stringify({
                    gold: self.vue.gold,
                    goldclickincrease: self.vue.goldclickincrease,
                    goldpersecond: self.vue.goldpersecond,
                    maxgold: self.vue.maxgold,
                    goblins: self.vue.goblins,
                    weapons: self.vue.weapons,
                    shop: self.vue.shop,
                    mines: self.vue.mines
                })
            });
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
            goblins: 0,
            weapons:0,
            shop: [{item_name:"Farm", price: 10, description: "Grows more (vegetable you don't like) than you can imagine!", amount: 0, gold_per_sec: .2, img:"/goblinvillage/static/images/farm.png"},
            {item_name:"General Store", price: 100, description: "Sells generals", amount: 0, gold_per_sec: 3, img:"/goblinvillage/static/images/store.png"},
            {item_name:"Tailor's Market", price: 1000, description: "Stocks a vast variety of products, but only one outfit ever gets bought", amount: 0, gold_per_sec: 35, img:"/goblinvillage/static/images/clothes.png"},
            {item_name:"Gemsmith", price: 10000, description: "Counterfeit glass", amount: 0, gold_per_sec: 400, img:"/goblinvillage/static/images/gem.png"},
            {item_name:"Oil Well", price: 100000, description: "Oil is like an energy drink to goblins", amount: 0, gold_per_sec: 4250, img:"/goblinvillage/static/images/oil.png"},
            {item_name:"Castle", price: 1000000, description: "More like a playground than a defensive structure", amount: 0, gold_per_sec: 45000, img:"/goblinvillage/static/images/castle.png"}],
            mines: [{item_name:"Copper Mine", price: 20, description: "When it comes to goblins, 'mine' has a double meaning", amount: 0, gold_per_click: 1, img:"/goblinvillage/static/images/coppermine.png"},
            {item_name:"Iron Mine", price: 200, description: "Iron is too difficult to work with, so goblins just use the rocks in this mine", amount: 0, gold_per_click: 10, img: "/goblinvillage/static/images/ironmine.png"},
            {item_name:"Lumber Mine", price: 2000, description: "Requires specialty pickaxes", amount: 0, gold_per_click: 100, img:"/goblinvillage/static/images/tree.png"},
            {item_name:"Gold Mine", price: 20000, description: "Creates gold, like all the other stuff here", amount: 0, gold_per_click: 1000, img:"/goblinvillage/static/images/goldmine.png"},
            {item_name:"Diamond Mine", price: 200000, description: "It's crystal clear that this mine is a gem in the rough, these diamonds rock!", amount: 0, gold_per_click: 10000, img:"/goblinvillage/static/images/diamondmine.png"}],
            attacking: false,
            attacking_village_name: "",
            attacking_power: 0,
            attacking_gps: 0,
            fight_ended: false
        }
        ,
        methods: {
            cookie_clicked: self.cookie_clicked,
            purchase_item: self.purchase_item,
            get_villages: self.get_villages
        }

    });


    self.get_village();
    self.auto_refresh();
    $("#vue-div").show();


    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
