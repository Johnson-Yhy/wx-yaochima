// pages/restaurants/restaurant.js
var app = getApp()

Page({
  data: {
    restaurantId: null,
    categoryLocked: false,
    priceLocked: false,
    currentCategory: null,
    currentPrice: null,
    exclusions: [],
    rest_exclusions: [],
    lockedcategory: null, 
    lockedprice: null, 
    errorMessage: null,
    status: null,
  }, 

  toggleCategory: function (event) {
    // console.log(event)
    this.setData({
      categoryLocked: !this.data.categoryLocked
    });
    // console.log(this.data.categoryLocked);
  },

  togglePrice: function (event) {
    // console.log(event)
    this.setData({
      priceLocked: !this.data.priceLocked
    });
    // console.log(this.data.priceLocked);
  },

  testShake: function(event) {
    this.shakeTest();
  },
  
  shakeTest: function (successCallback) {

    // this.setData({
    //   lockedcategory: null,
    //   lockedprice: null,
    // });

    // console.log(event);
    let that = this;

    
    this.data.rest_exclusions.push(this.data.restaurantId);

    if (this.data.categoryLocked && !this.data.priceLocked) {
      this.setData({
        lockedcategory: this.data.currentCategory,
        lockedprice: null
      });
      // console.log("category locked");
      // console.log(this.data.lockedcategory);
      // console.log(this.data.lockedprice);

    } else if (this.data.categoryLocked && this.data.priceLocked) {
      this.setData({
        lockedcategory: this.data.currentCategory,
        lockedprice: this.data.currentPrice,
      });
      // console.log("both locked");
      // console.log(this.data.lockedcategory);
      // console.log(this.data.lockedprice);

    } else if (!this.data.categoryLocked && this.data.priceLocked) {
      this.setData({
        lockedcategory: null,
        lockedprice: this.data.currentPrice,
      });
      this.data.exclusions.push(this.data.currentCategory);
      // console.log("price locked");
      // console.log(this.data.lockedcategory);
      // console.log(this.data.lockedprice);
      // console.log(this.data.exclusions)

    } else {
        this.data.exclusions.push(this.data.currentCategory);
        // console.log("none locked");
        // console.log(this.data.lockedcategory);
        // console.log(this.data.lockedprice);
        // console.log(this.data.exclusions)
    }

    wx.request({
      url: 'https://yaochima.shanghaiwogeng.com/api/v1/shakes',
      method: 'post',
      data: {
        "lat": app.globalData.lat, 
        "lng": app.globalData.lng,
        "rest_exclusions": this.data.rest_exclusions,
        "exclusions": this.data.exclusions,
        "lockedcategory": this.data.lockedcategory,
        "lockedprice": this.data.lockedprice,
        
      },
      success: function (res) {
        // console.log("important: subsequent shake response")
        // console.log(res.data)
        if (res.data.status == "ok" ){

          console.log("status:")
          console.log(res.data.status)
          console.log("id:")
          console.log(res.data.restaurants.id)

          that.setData({
            restaurantId: res.data.restaurants.id,
            status: res.data.status,
          });
          that.loadRestaurantData(successCallback);
        } else if (res.data.status == "error" ) {
          // console.log("printing exclusions")
          // console.log(this.data.exclusions)
          // console.log("status:")
          // console.log(res.data.status)
          // console.log("error")
          // console.log(res.data.error.error_message)
          that.setData({
            errorMessage: res.data.error.error_message,
            exclusions: []
          });
          wx.showModal({
            title: 'Whoops!',
            content: that.data.errorMessage,
            confirmText: "OK",
            showCancel: false,
            success: function (res) {
              console.log('success modal')
              console.log("going back to beginning")
              wx.navigateTo({
                url: '../index/index'
              })
            }
          });
          
          
        }
      }
    })
  },

  onLoad: function (options) {
    console.log(options)
    console.log("restaurantoptions")
    console.log(options.id)
    this.setData({
      restaurantId: Number(options.id)
    });
    this.loadRestaurantData();

    let that = this;

    app.globalData.shakeManager.register(this, function (args) {
      // when shaked
      // console.log("Shaked!")
      that.shakeTest(args.done);
    });

  },
  
  loadRestaurantData: function (successCallback) {
    let restaurantId = this.data.restaurantId;

    wx.request ({
      // url: 'https://yaochima.herokuapp.com/api/v1/restaurants/1',
      url: "https://yaochima.shanghaiwogeng.com/api/v1/restaurants/" + restaurantId,
      method: 'get',
      header: { },
      success:  (res) => {
        console.log('successful!')
        console.log(res)
        console.log()
          this.setData({
            name: res.data.name,
            category: res.data.category,
            mainPhoto: res.data.profile_photo, 
            rating: res.data.rating, 
            price: res.data.price_per_person, 
            phone: res.data.phone_number, 
            address: res.data.address,
            currentCategory: res.data.category,
            currentPrice: res.data.price_per_person
          }); 
          if (successCallback) {
            successCallback();
            this.shakeSound = wx.createAudioContext("shakeSound")
            console.log("HAHAH")
            this.shakeSound.play()
          }
        },
    })
  },

  errorMessageToast: function () {
    wx.showToast({
      title: errorMessage,
      icon: 'loading',
      duration: 1500
    });
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
  
  return {
    title: '摇来这儿吃嘛 😊',
    path: 'pages/share/share?id=' + this.data.restaurantId
  }
  }
})