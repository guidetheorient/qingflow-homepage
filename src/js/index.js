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
    this.$container.on('click',(e)=>{
      console.log(this.$container[0].getBoundingClientRect())
      console.dir(e)
    })
  },
  move:function(x){
    if($(document).width() >= 992){
      this.$handle[0].style.left = x+'px'
      this.$rightImg[0].style.width = x+'px'
      this.$leftImg[0].style.width = (952 -x)+'px'
    }
    
  }
}
shiftImg.init();

var scrollChangeColor = {
  init:function($element){
    this.$element = $element
    this.bind()
  },
  bind:function(){
    $(document).on('scroll',()=> {
      if($(document).scrollTop() <= 30){
          this.$element.removeClass('scroll')
      } else {
          this.$element.addClass('scroll')
      }
    })
  }
}
scrollChangeColor.init($('#nav'))