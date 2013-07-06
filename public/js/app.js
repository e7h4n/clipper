// store
var _store = {
  // 返回一个唯一的article id;
  // 这个id也是articles的数组index
  aid: function() {
    var articles = this.fetch();
    if (articles.length != 0) {
      return articles[articles.length -1].aid + 1;
    } else {
      return 0;
    }
  },
  // 从原始数据从生成新的文章
  set: function(value) {
    if (value) {
      var aid = this.aid();
      console.log(aid);
      localStorage.setItem('article' + aid,JSON.stringify({
        aid: aid,
        content: value
      }));
      this.push(aid);
    } else {
      return false;
    }
  },
  // 保存
  save: function(key,value) {
    if (key) {
      localStorage.setItem(key,value);
      return key;
    } else {
      return false;
    }
  },
  // 将单篇文章推送到全部文章的数组里
  push: function(id) {
    console.log('pushing...');
    var articles = this.fetch();
    var article = this.get(id);
    articles.push(article);
    this.save('articles',JSON.stringify(articles));
  },
  // 根据ID拿到单篇文章
  get: function(key) {
    if (localStorage.getItem('article' + key)) {
      return JSON.parse(localStorage.getItem('article' + key));
    } else {
      return null
    }
  },
  // 拿到所有文章
  fetch: function() {
    var articles = localStorage.getItem('articles');
    if (articles != null) {
      return JSON.parse(articles);
    } else {
      return [];
    }
  },
  // 删除一篇文章
  remove: function(id) {
    // 首先删除单独保存的，然后删除所有文章列表中的
    localStorage.removeItem('article' + id);
    var articles = this.fetch();
    if (articles) {
      delete articles[id];
    } else {
      return false;
    }
  }
};

//app.js
var clipperApp = {
  ctrls: {
    articles: function($scope) {
      $scope.articles = _store.fetch();
      console.log($scope.articles);
    },
    article: function($scope,$routeParams) {
      var articleID = $routeParams.rid;
      $scope.article = _store.get(articleID);
      $scope.remove = function(id) {
        _store.remove(id);
      }
    }
  }
};

var clipper = angular.module('clipper', [])
.directive('dragAndDrop', function() {
  return {
    restrict: 'A',
    link: function($scope, elem, attr) {
      var clearTimer = null;

      $scope.text = "拖放到这里";

      elem.bind('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();

        clearTimeout(clearTimer);
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = 'copy';
        }
      });

      elem.bind('dragenter', function(e) {
        e.stopPropagation();
        e.preventDefault();

        clearTimeout(clearTimer);
        $scope.$apply(function() {
          $scope.text = '松开鼠标';
        });
      });

      elem.bind('dragleave', function(e) {
        e.stopPropagation();
        e.preventDefault();

        clearTimeout(clearTimer);
        $scope.$apply(function() {
          $scope.text = '拖放到这里';
        });
      });

      elem.bind('drop', function(e) {
        e.stopPropagation();
        e.preventDefault();

        var html = null;

        try {
          html = e.originalEvent.dataTransfer.getData('text/html');
        } catch (err) {}

        var tip = html ? '内容已保存' : '错误的内容';

        $scope.$apply(function () {
          $scope.text = tip;
        });

        clearTimeout(clearTimer);
        clearTimer = setTimeout(function () {
          $scope.$apply(function () {
            $scope.text = '拖放到这里';
          });
        }, 1000);

        if (html) {
          _store.set(html);
        }
      });
    }
  };
})
.config(function($routeProvider) {
  $routeProvider.
    when('/articles', {
    controller: clipperApp.ctrls.articles,
    templateUrl: 'views/articles.html'
  }).
    when('/clipper', {
    controller: clipperApp.clipper,
    templateUrl: 'views/clipper.html'
  }).
    when('/article', {
    controller: clipperApp.ctrls.article,
    templateUrl: 'views/article.html'
  }).
    otherwise({
    redirectTo: '/clipper'
  });
});

// vim: sts=2 ts=2 sw=2 :
