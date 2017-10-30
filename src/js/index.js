var shiftImg = {
  init:function(){
    this.$handle = $('.handle'),
    this.$tracker = $('.tracker'),
    this.$leftImg = $('.left'),
    this.$rightImg = $('.right'),
    this.$container = $('.shift-img')
    this.bind()
    this.move(476)
  },
  bind:function(){
    this.$handle.on('mousedown',()=>{
      console.log('mousedown')
      this.$tracker.css('display','block') 
    })
    this.$tracker.on('mouseup',()=>{
      console.log('mouseup')
      this.$tracker.css('display','none') 
    })
    this.$tracker.on('mousemove',(e)=>{
      let cBox = this.$container[0].getBoundingClientRect();
      var hBox = this.$handle[0].getBoundingClientRect();
      var newX = e.clientX-cBox.left
      
      if(newX > cBox.width-hBox.width)
         newX = cBox.width-hBox.width
   
      if(newX < 0)
         newX = 0
      this.move(newX)
    })
  },
  move:function(x){
    this.$handle[0].style.left = x+'px'
    this.$rightImg[0].style.width = x+'px'
    this.$leftImg[0].style.width = (952 -x)+'px'
  }
}
shiftImg.init();



  // html: {
  //    handle: document.querySelectorAll('.handle')[0],
  //    tracker: document.querySelectorAll('.handle .tracker')[0],
  //    code: document.querySelectorAll('.code')[0],
  //    view: document.querySelectorAll('.view')[0],
  //    example: document.querySelectorAll('.example')[0],
  //    container: document.querySelectorAll('.container')[0]
  // },
 //  dragging: false,
  // init: function(){
  //    this.addEvents()
  //    this.move(250)
  // },
  // addEvents: function(){
  //    var that = this
  //    this.html.handle.addEventListener('mousedown', function(e){
  //      console.log('mousedown')
  //       that.html.tracker.style.display = 'block'
  //      //  that.dragging = true
  //    }) 
  //    this.html.tracker.addEventListener('mouseup', function(){
  //       that.html.tracker.style.display = 'none'
  //      //  that.dragging = false
  //    }) 
  //    this.html.tracker.addEventListener('mousemove', function(event){
  //       var cBox = that.html.container.getBoundingClientRect();
  //       var hBox = that.html.handle.getBoundingClientRect();
  //       var newX = event.clientX-cBox.left
        
  //       if(newX > cBox.width-hBox.width)
  //          newX = cBox.width-hBox.width
     
  //       if(newX < 0)
  //          newX = 0
  //       that.move(newX)
  //    })   
  // },
  // move: function(x){
  //    this.html.handle.style.left = x+'px'
  //    this.html.example.style.width = (x)+'px'
  // }