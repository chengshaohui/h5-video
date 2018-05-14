exports.install = function(Vue, options) {
  /* 1. add global method or property */
  Vue.myGlobalMethod = {}
  /* 2. add global asset */
  Vue.directive('title', {
    inserted: function(el, binding) {
      document.title = binding.value
    }
  })
  Vue.directive('isFocus', {
    // 当被绑定的元素插入到 DOM 中时……
    inserted: function(el, binding) {
      if (binding.value)
        el.focus()
      else
        el.blur()
    },
    componentUpdated: function(el, binding) {
      if (binding.value)
        el.focus();
      else
        el.blur();
    }
  })
  Vue.filter('time', function formatDate(time) {
      var time = new Date(parseInt(time))

      function fun(n) {
        return n = n < 10 ? ('0' + n) : n
      }

      return time.getFullYear() + '-' + fun(time.getMonth() + 1) + '-' + fun(time.getDate()) + ' ' + fun(time.getHours()) + ':' + fun(time.getMinutes())
    }
  )
  /* 3. add instance method */
  // 去掉所有的html标记
  Vue.prototype.$_delHtmlTag = function(htmlText) {
    return htmlText.replace(/<[^>]+>/g, '')
  }
  // 暂数上千显示k,上万显示w
  Vue.prototype.$_numberTrans = function(num) {
    let k = 1000
    let w = 10000
    if (num >= k && num <= w) {
      num = parseInt(num / k)
      num = parseInt(num) + "k"
    } else if (num > w) {
      num = parseInt(num / w)
      num = parseInt(num) + "w"
    }
    return num
  }
}
